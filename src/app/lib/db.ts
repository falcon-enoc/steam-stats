if (typeof window !== 'undefined') {
  throw new Error('db.ts cannot be imported in the browser');
}

import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { GameDetailsData } from '../types/steam-store';

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS app_cache (
  appid       INTEGER PRIMARY KEY,
  name        TEXT,
  is_free     INTEGER NOT NULL DEFAULT 0,
  type        TEXT,
  data_json   TEXT NOT NULL,
  fetched_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS price_history (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  appid            INTEGER NOT NULL,
  currency         TEXT NOT NULL,
  initial_price    INTEGER NOT NULL,
  final_price      INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  recorded_at      INTEGER NOT NULL,
  UNIQUE(appid, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_price_appid ON price_history(appid, recorded_at);

CREATE TABLE IF NOT EXISTS demo_sessions (
  ip         TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
`;

let defaultDb: DatabaseType | null = null;

export function createDatabase(dbPath: string): DatabaseType {
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(INIT_SQL);
  return db;
}

function getDefaultDb(): DatabaseType {
  if (!defaultDb) {
    const dbPath = path.resolve(process.cwd(), 'data', 'steam-stats.sqlite');
    defaultDb = createDatabase(dbPath);
  }
  return defaultDb;
}

const MAX_APPIDS_PER_QUERY = 500

export function getCachedAppDetails(
  appids: number[],
  maxAgeMs: number,
  db?: DatabaseType,
): Record<string, { success: true; data: GameDetailsData }> {
  const conn = db ?? getDefaultDb();
  if (appids.length === 0) return {};
  if (appids.length > MAX_APPIDS_PER_QUERY) {
    throw new Error(`Too many appids: max ${MAX_APPIDS_PER_QUERY}, got ${appids.length}`)
  }

  const minFetchedAt = Date.now() - maxAgeMs;
  const placeholders = appids.map(() => '?').join(',');
  const stmt = conn.prepare(
    `SELECT appid, data_json FROM app_cache WHERE appid IN (${placeholders}) AND fetched_at >= ?`,
  );
  const rows = stmt.all(...appids, minFetchedAt) as Array<{ appid: number; data_json: string }>;

  const result: Record<string, { success: true; data: GameDetailsData }> = {};
  for (const row of rows) {
    result[String(row.appid)] = {
      success: true,
      data: JSON.parse(row.data_json) as GameDetailsData,
    };
  }
  return result;
}

export function setCachedAppDetails(
  appid: number,
  data: GameDetailsData,
  db?: DatabaseType,
): void {
  const conn = db ?? getDefaultDb();
  const now = Date.now();

  const upsertApp = conn.prepare(`
    INSERT INTO app_cache (appid, name, is_free, type, data_json, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(appid) DO UPDATE SET
      name = excluded.name,
      is_free = excluded.is_free,
      type = excluded.type,
      data_json = excluded.data_json,
      fetched_at = excluded.fetched_at
  `);

  upsertApp.run(
    appid,
    data.name ?? null,
    data.is_free ? 1 : 0,
    data.type ?? null,
    JSON.stringify(data),
    now,
  );

  // Insert price history if price data exists and no record for today
  const priceOverview = data.price_overview;
  if (priceOverview) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const recordedAt = startOfDay.getTime();

    const insertPrice = conn.prepare(`
      INSERT OR IGNORE INTO price_history (appid, currency, initial_price, final_price, discount_percent, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPrice.run(
      appid,
      priceOverview.currency,
      priceOverview.initial,
      priceOverview.final,
      priceOverview.discount_percent,
      recordedAt,
    );
  }
}

export interface HistoricalPriceSummary {
  appid: number;
  initial_price: number;   // precio sin descuento (más reciente)
  final_price: number;     // precio actual (más reciente)
  lowest_price: number;    // precio más bajo registrado históricamente
  lowest_date: number;     // timestamp de cuando se registró el precio más bajo
  currency: string;
}

/**
 * Obtiene resumen de precios para una lista de appids:
 * - initial_price: precio base sin descuento (último registro)
 * - final_price: precio actual con descuento si aplica (último registro)
 * - lowest_price: el precio más bajo jamás registrado
 */
export function getHistoricalPrices(
  appids: number[],
  db?: DatabaseType,
): Record<string, HistoricalPriceSummary> {
  const conn = db ?? getDefaultDb();
  if (appids.length === 0) return {};

  const placeholders = appids.map(() => '?').join(',');

  // Query 1: precio más reciente por appid
  const latestStmt = conn.prepare(`
    SELECT p.appid, p.currency, p.initial_price, p.final_price
    FROM price_history p
    INNER JOIN (
      SELECT appid, MAX(recorded_at) as max_date
      FROM price_history
      WHERE appid IN (${placeholders})
      GROUP BY appid
    ) latest ON p.appid = latest.appid AND p.recorded_at = latest.max_date
  `);
  const latestRows = latestStmt.all(...appids) as Array<{
    appid: number; currency: string; initial_price: number; final_price: number;
  }>;

  // Query 2: precio mínimo histórico por appid
  const lowestStmt = conn.prepare(`
    SELECT appid, MIN(final_price) as lowest_price, recorded_at as lowest_date
    FROM price_history
    WHERE appid IN (${placeholders})
    GROUP BY appid
  `);
  const lowestRows = lowestStmt.all(...appids) as Array<{
    appid: number; lowest_price: number; lowest_date: number;
  }>;

  const lowestMap = new Map(lowestRows.map(r => [r.appid, r]));

  const result: Record<string, HistoricalPriceSummary> = {};
  for (const row of latestRows) {
    const lowest = lowestMap.get(row.appid);
    result[String(row.appid)] = {
      appid: row.appid,
      initial_price: row.initial_price,
      final_price: row.final_price,
      lowest_price: lowest?.lowest_price ?? row.final_price,
      lowest_date: lowest?.lowest_date ?? 0,
      currency: row.currency,
    };
  }
  return result;
}

const DEMO_WINDOW_MS = 30 * 60 * 1000   // 30 min para cargar todo
const DEMO_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24h antes de poder repetir

/**
 * Intenta iniciar una sesión demo para la IP dada.
 * Retorna true si la sesión fue creada o está activa.
 * Retorna false si el cooldown de 24h no ha pasado.
 */
export function startDemoSession(ip: string, db?: DatabaseType): boolean {
  const conn = db ?? getDefaultDb()
  const now = Date.now()

  const existing = conn.prepare(
    'SELECT started_at, expires_at FROM demo_sessions WHERE ip = ?'
  ).get(ip) as { started_at: number; expires_at: number } | undefined

  if (existing) {
    // Sesión activa — dentro de la ventana de 30 min
    if (now < existing.expires_at) return true
    // Cooldown de 24h aún activo
    if (now - existing.started_at < DEMO_COOLDOWN_MS) return false
  }

  // Nueva sesión o cooldown vencido — crear/renovar
  conn.prepare(`
    INSERT INTO demo_sessions (ip, started_at, expires_at)
    VALUES (?, ?, ?)
    ON CONFLICT(ip) DO UPDATE SET started_at = excluded.started_at, expires_at = excluded.expires_at
  `).run(ip, now, now + DEMO_WINDOW_MS)

  return true
}

/**
 * Verifica si la IP tiene una sesión demo activa (dentro de la ventana de 30 min).
 */
export function isDemoSessionActive(ip: string, db?: DatabaseType): boolean {
  const conn = db ?? getDefaultDb()
  const now = Date.now()
  const row = conn.prepare(
    'SELECT expires_at FROM demo_sessions WHERE ip = ?'
  ).get(ip) as { expires_at: number } | undefined
  return !!row && now < row.expires_at
}

export function getUncachedAppIds(
  appids: number[],
  maxAgeMs: number,
  db?: DatabaseType,
): number[] {
  const conn = db ?? getDefaultDb();
  if (appids.length === 0) return [];
  if (appids.length > MAX_APPIDS_PER_QUERY) {
    throw new Error(`Too many appids: max ${MAX_APPIDS_PER_QUERY}, got ${appids.length}`)
  }

  const minFetchedAt = Date.now() - maxAgeMs;
  const placeholders = appids.map(() => '?').join(',');
  const stmt = conn.prepare(
    `SELECT appid FROM app_cache WHERE appid IN (${placeholders}) AND fetched_at >= ?`,
  );
  const rows = stmt.all(...appids, minFetchedAt) as Array<{ appid: number }>;
  const cachedSet = new Set(rows.map((r) => r.appid));
  return appids.filter((id) => !cachedSet.has(id));
}
