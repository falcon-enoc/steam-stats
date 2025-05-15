module.exports = {

"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/lib/fetcher.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/fetcher.ts
/**
 * Wrapper sobre fetch con manejo de errores y parseo de JSON.
 * @param input URL o RequestInfo para la petición
 * @param init Opciones de fetch (headers, método, body, etc.)
 * @returns Datos parseados como T
 * @throws Error si la respuesta HTTP no es ok o el JSON no es válido
 */ __turbopack_context__.s({
    "default": (()=>fetcher)
});
async function fetcher(input, init) {
    const res = await fetch(input, init);
    const text = await res.text();
    // Intentamos parsear JSON, si falla y era ok, lanzamos error de parseo
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (err) {
        if (res.ok) {
            throw new Error(`Error parsing JSON: ${err.message}`);
        }
        // Si no es ok y parse falla, fallback a texto plano
        throw new Error(`HTTP error ${res.status}: ${text}`);
    }
    if (!res.ok) {
        // Intentamos extraer mensaje de error desde el JSON
        const message = data && data.error || res.statusText;
        throw new Error(`HTTP error ${res.status}: ${message}`);
    }
    return data;
}
}}),
"[project]/src/app/hooks/useSteamPlayer.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
//hooks/useSteamPlayer.ts
__turbopack_context__.s({
    "useSteamPlayer": (()=>useSteamPlayer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$react$2d$server$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/react-server.mjs [app-rsc] (ecmascript) <exports>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/fetcher.ts [app-rsc] (ecmascript)");
;
;
function useSteamPlayer(steamId) {
    const { data, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$react$2d$server$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$exports$3e$__["default"])(()=>steamId && `/api/steam/getPlayerSummaries?steamids=${steamId}`, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]);
    return {
        player: data?.players[0],
        isLoading: !error && !data,
        isError: error
    };
}
}}),
"[project]/src/app/components/SteamPlayerCard.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SteamPlayerCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSteamPlayer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useSteamPlayer.ts [app-rsc] (ecmascript)");
;
;
;
;
const statusMap = {
    0: 'Offline',
    1: 'Online',
    2: 'Busy',
    3: 'Away',
    4: 'Snooze',
    5: 'Looking to trade',
    6: 'Looking to play'
};
function SteamPlayerCard({ steamId, player: propPlayer }) {
    // Si se proporciona steamId, usamos el hook para obtener los datos
    const { player: hookPlayer, isLoading, isError } = steamId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSteamPlayer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useSteamPlayer"])(steamId) : {
        player: undefined,
        isLoading: false,
        isError: undefined
    };
    // Usamos el player proporcionado como prop o el obtenido del hook
    const player = propPlayer || hookPlayer;
    // Estado de carga
    if (steamId && isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: 0.3
            },
            className: "max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Cargando perfil..."
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    // Estado de error
    if (steamId && isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: 0.3
            },
            className: "max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500",
                children: "Error al cargar el perfil"
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this);
    }
    // Si no hay datos del jugador
    if (!player) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: 0.3
            },
            className: "max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No se encontró información del jugador"
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    // Si tenemos datos del jugador, mostramos la tarjeta
    const { avatarfull, personaname, personastate, lastlogoff, profileurl, realname } = player;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.3
        },
        className: "max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex space-x-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-24 h-24 relative flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    src: avatarfull,
                    alt: `${personaname} avatar`,
                    layout: "fill",
                    className: "rounded-full"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold",
                        children: personaname
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    realname && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: realname
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 99,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm",
                        children: [
                            "Status: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: statusMap[personastate]
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                                lineNumber: 101,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    lastlogoff && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500",
                        children: [
                            "Last seen: ",
                            new Date(lastlogoff * 1000).toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: profileurl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "mt-3 inline-block text-blue-600 hover:underline",
                        children: "Ver perfil"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/config.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/services/steamService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getPlayerSummaries": (()=>getPlayerSummaries)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/config.ts [app-rsc] (ecmascript)"); // cargado desde process.env en build
;
const BASE = 'https://api.steampowered.com';
async function getPlayerSummaries(steamIds) {
    const url = `${BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STEAM_KEY"]}&steamids=${steamIds.join(',')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Steam API error: ${res.status}`);
    const json = await res.json();
    return json.response.players;
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/page.tsx
__turbopack_context__.s({
    "default": (()=>HomePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SteamPlayerCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/SteamPlayerCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$steamService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/steamService.ts [app-rsc] (ecmascript)");
;
;
;
async function HomePage() {
    // ejemplo: pilla un SteamID fijo
    const steamIds = [
        '76561197960435530'
    ];
    const players = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$steamService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlayerSummaries"])(steamIds);
    const player = players[0] // suponiendo que exista
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold",
                children: "Bienvenido a Mi Steam App"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$SteamPlayerCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                player: player
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_4ac67988._.js.map