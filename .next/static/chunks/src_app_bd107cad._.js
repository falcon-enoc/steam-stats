(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/lib/fetcher.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/hooks/useSteamPlayer.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
//hooks/useSteamPlayer.ts
__turbopack_context__.s({
    "useSteamPlayer": (()=>useSteamPlayer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/fetcher.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useSteamPlayer(steamId) {
    _s();
    const { data, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
        "useSteamPlayer.useSWR": ()=>steamId && `/api/steam/getPlayerSummaries?steamids=${steamId}`
    }["useSteamPlayer.useSWR"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    return {
        player: data?.players[0],
        isLoading: !error && !data,
        isError: error
    };
}
_s(useSteamPlayer, "r2QYs02BSrn+Eu/1uMGZi8N+HnQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/components/SteamPlayerCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SteamPlayerCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSteamPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useSteamPlayer.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    _s();
    // Si se proporciona steamId, usamos el hook para obtener los datos
    const { player: hookPlayer, isLoading, isError } = steamId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSteamPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSteamPlayer"])(steamId) : {
        player: undefined,
        isLoading: false,
        isError: undefined
    };
    // Usamos el player proporcionado como prop o el obtenido del hook
    const player = propPlayer || hookPlayer;
    // Estado de carga
    if (steamId && isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Cargando perfil..."
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    // Estado de error
    if (steamId && isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500",
                children: "Error al cargar el perfil"
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    // Si no hay datos del jugador
    if (!player) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No se encontró información del jugador"
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    // Si tenemos datos del jugador, mostramos la tarjeta
    const { avatarfull, personaname, personastate, lastlogoff, profileurl, realname } = player;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-24 h-24 relative flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: avatarfull,
                    alt: `${personaname} avatar`,
                    layout: "fill",
                    className: "rounded-full"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold",
                        children: personaname
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    realname && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600",
                        children: realname
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 100,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm",
                        children: [
                            "Status: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: statusMap[personastate]
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                                lineNumber: 102,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    lastlogoff && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500",
                        children: [
                            "Last seen: ",
                            new Date(lastlogoff * 1000).toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: profileurl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "mt-3 inline-block text-blue-600 hover:underline",
                        children: "Ver perfil"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/SteamPlayerCard.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_s(SteamPlayerCard, "K6rKS4tsEt5qLBmcRVdZvKvLp6g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSteamPlayer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSteamPlayer"]
    ];
});
_c = SteamPlayerCard;
var _c;
__turbopack_context__.k.register(_c, "SteamPlayerCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_bd107cad._.js.map