module.exports = {

"[project]/.next-internal/server/app/api/getPlayerSummaries/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/config.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// config.ts
/**
 * Centraliza la carga de variables de entorno.
 * Lanza un error si falta alguna variable requerida.
 */ // Asegúrate de definir STEAM_KEY en tu .env.local (no con NEXT_PUBLIC_)
__turbopack_context__.s({
    "STEAM_KEY": (()=>STEAM_KEY)
});
if (!process.env.STEAM_KEY) {
    throw new Error('Missing required environment variable: STEAM_KEY');
}
const STEAM_KEY = process.env.STEAM_KEY; // Puedes añadir más variables aquí según tus necesidades:
 // export const ANOTHER_KEY = process.env.ANOTHER_KEY ?? '';
}}),
"[project]/src/app/lib/fetcher.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/fetcher.ts
__turbopack_context__.s({
    "default": (()=>fetcher)
});
const cache = new Map();
async function fetcher(input, init, ttl = 10000) {
    const key = typeof input === 'string' ? input : JSON.stringify(input);
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expiry > now) {
        return cached.data;
    }
    const res = await fetch(input, init);
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (err) {
        if (res.ok) {
            throw new Error(`Error parsing JSON: ${err.message}`);
        }
        throw new Error(`HTTP error ${res.status}: ${text}`);
    }
    if (!res.ok) {
        const message = data && data.error || res.statusText;
        throw new Error(`HTTP error ${res.status}: ${message}`);
    }
    cache.set(key, {
        data,
        expiry: now + ttl
    });
    return data;
}
}}),
"[project]/src/app/services/steamService.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// servises/SteamServise.ts
__turbopack_context__.s({
    "ResolveVanityURL": (()=>ResolveVanityURL),
    "getPlayerSummaries": (()=>getPlayerSummaries)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/config.ts [app-route] (ecmascript)"); // cargado desde process.env en build
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/fetcher.ts [app-route] (ecmascript)");
;
;
const BASE = 'https://api.steampowered.com';
async function getPlayerSummaries(steamIds) {
    const url = `${BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STEAM_KEY"]}&steamids=${steamIds.join(',')}`;
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(url);
    return data.response.players;
}
async function ResolveVanityURL(vanityUrl) {
    const url = `${BASE}/ISteamUser/ResolveVanityURL/v1/?key=${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STEAM_KEY"]}&vanityurl=${vanityUrl}`;
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(url);
    return data.response.steamid;
}
}}),
"[project]/src/app/api/getPlayerSummaries/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
//api/steam/getPlayerSummaries.ts
__turbopack_context__.s({
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$steamService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/steamService.ts [app-route] (ecmascript)");
;
async function handler(req, res) {
    try {
        const { steamids } = req.query;
        if (!steamids) {
            return res.status(400).json({
                error: 'steamids is required'
            });
        }
        const ids = Array.isArray(steamids) ? steamids : steamids.split(',');
        console.log("ohola");
        console.log(ids);
        const players = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$steamService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPlayerSummaries"])(ids);
        return res.status(200).json({
            players
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3aa923ee._.js.map