// types/steam-webapi.d.ts
// Tipos para Steam Web API oficial (requires API key)
// Incluye APIs de usuarios, perfiles y juegos poseídos

// Representa un jugador tal como lo devuelve GetPlayerSummaries
export interface Player {
  steamid: string;
  communityvisibilitystate: number;
  profilestate?: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff?: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
}

// Estructura de la respuesta de GetPlayerSummaries
export interface PlayerSummariesResponse {
  response: {
    players: Player[];
  };
}

// Representa un juego con estadísticas de OwnedGames
export interface OwnedGame {
  appid: number;
  name?: string; // Algunas respuestas incluyen el nombre si se solicita mediante include_appinfo
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  has_community_visible_stats: boolean;
  rtime_last_played?: number;
  // Campos añadidos para detalles del juego y precio
  game_details?: import('./steam-store').GameDetailsData;
  hours_per_dollar?: number | string; // Puede ser 'N/A', 'Gratis' o un número (legacy)
  // Campos añadidos para información de precio de la tienda
  price_overview?: import('./steam-store').PriceOverview;
  is_free?: boolean;
}

// Estructura de la respuesta de GetOwnedGames
export interface OwnedGamesResponse {
  response: {
    game_count: number;
    games: OwnedGame[];
  };
}

// Respuesta de ResolveVanityURL
export interface ResolveVanityURLResponse {
  response: {
    steamid?: string;
    success: number; // 1 = éxito, 42 = no encontrado
    message?: string;
  };
}