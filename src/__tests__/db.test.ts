import { describe, it, expect, beforeEach } from 'vitest';
import type { Database as DatabaseType } from 'better-sqlite3';
import { createDatabase, getCachedAppDetails, setCachedAppDetails, getUncachedAppIds } from '../app/lib/db';
import type { GameDetailsData } from '../app/types/steam-store';

function makeSampleGame(appid: number, overrides?: Partial<GameDetailsData>): GameDetailsData {
  return {
    steam_appid: appid,
    name: `Test Game ${appid}`,
    type: 'game',
    is_free: false,
    price_overview: {
      currency: 'USD',
      initial: 1999,
      final: 999,
      discount_percent: 50,
      initial_formatted: '$19.99',
      final_formatted: '$9.99',
    },
    ...overrides,
  };
}

describe('db cache layer', () => {
  let db: DatabaseType;

  beforeEach(() => {
    db = createDatabase(':memory:');
  });

  describe('table creation', () => {
    it('creates app_cache and price_history tables', () => {
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        .all() as Array<{ name: string }>;
      const names = tables.map((t) => t.name);
      expect(names).toContain('app_cache');
      expect(names).toContain('price_history');
    });
  });

  describe('setCachedAppDetails', () => {
    it('inserts into both app_cache and price_history', () => {
      const game = makeSampleGame(440);
      setCachedAppDetails(440, game, db);

      const appRow = db.prepare('SELECT * FROM app_cache WHERE appid = ?').get(440) as any;
      expect(appRow).toBeDefined();
      expect(appRow.name).toBe('Test Game 440');
      expect(appRow.is_free).toBe(0);
      expect(appRow.type).toBe('game');
      expect(JSON.parse(appRow.data_json)).toEqual(game);

      const priceRow = db.prepare('SELECT * FROM price_history WHERE appid = ?').get(440) as any;
      expect(priceRow).toBeDefined();
      expect(priceRow.currency).toBe('USD');
      expect(priceRow.initial_price).toBe(1999);
      expect(priceRow.final_price).toBe(999);
      expect(priceRow.discount_percent).toBe(50);
    });

    it('does not insert price_history for free games without price_overview', () => {
      const game = makeSampleGame(570, { is_free: true, price_overview: undefined });
      setCachedAppDetails(570, game, db);

      const priceRows = db.prepare('SELECT * FROM price_history WHERE appid = ?').all(570);
      expect(priceRows).toHaveLength(0);
    });
  });

  describe('getCachedAppDetails', () => {
    it('returns data within TTL', () => {
      const game = makeSampleGame(730);
      setCachedAppDetails(730, game, db);

      const result = getCachedAppDetails([730], 60_000, db);
      expect(result['730']).toBeDefined();
      expect(result['730'].success).toBe(true);
      expect(result['730'].data.name).toBe('Test Game 730');
    });

    it('ignores expired data', () => {
      const game = makeSampleGame(730);
      setCachedAppDetails(730, game, db);

      // Manually set fetched_at to the past
      db.prepare('UPDATE app_cache SET fetched_at = ? WHERE appid = ?').run(
        Date.now() - 120_000,
        730,
      );

      const result = getCachedAppDetails([730], 60_000, db);
      expect(result['730']).toBeUndefined();
    });

    it('returns empty record for empty appids array', () => {
      const result = getCachedAppDetails([], 60_000, db);
      expect(result).toEqual({});
    });

    it('returns only cached entries when some are missing', () => {
      setCachedAppDetails(440, makeSampleGame(440), db);

      const result = getCachedAppDetails([440, 570], 60_000, db);
      expect(result['440']).toBeDefined();
      expect(result['570']).toBeUndefined();
    });
  });

  describe('getUncachedAppIds', () => {
    it('returns all IDs when cache is empty', () => {
      const result = getUncachedAppIds([440, 570, 730], 60_000, db);
      expect(result).toEqual([440, 570, 730]);
    });

    it('returns only missing/stale IDs', () => {
      setCachedAppDetails(440, makeSampleGame(440), db);
      setCachedAppDetails(730, makeSampleGame(730), db);

      const result = getUncachedAppIds([440, 570, 730], 60_000, db);
      expect(result).toEqual([570]);
    });

    it('returns stale IDs', () => {
      setCachedAppDetails(440, makeSampleGame(440), db);

      // Make it stale
      db.prepare('UPDATE app_cache SET fetched_at = ? WHERE appid = ?').run(
        Date.now() - 120_000,
        440,
      );

      const result = getUncachedAppIds([440], 60_000, db);
      expect(result).toEqual([440]);
    });

    it('returns empty array for empty input', () => {
      const result = getUncachedAppIds([], 60_000, db);
      expect(result).toEqual([]);
    });
  });

  describe('price_history deduplication', () => {
    it('does not duplicate same-day records', () => {
      const game = makeSampleGame(440);
      setCachedAppDetails(440, game, db);
      setCachedAppDetails(440, game, db);

      const rows = db.prepare('SELECT * FROM price_history WHERE appid = ?').all(440);
      expect(rows).toHaveLength(1);
    });
  });

  describe('upsert behavior in app_cache', () => {
    it('updates existing entry on re-insert', () => {
      setCachedAppDetails(440, makeSampleGame(440, { name: 'Old Name' }), db);
      setCachedAppDetails(440, makeSampleGame(440, { name: 'New Name' }), db);

      const rows = db.prepare('SELECT * FROM app_cache WHERE appid = ?').all(440) as any[];
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('New Name');

      const parsed = JSON.parse(rows[0].data_json);
      expect(parsed.name).toBe('New Name');
    });
  });
});
