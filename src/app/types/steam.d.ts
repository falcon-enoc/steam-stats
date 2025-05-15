// types/steam.d.ts

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
  }
  
  // Estructura de la respuesta de GetOwnedGames
  export interface OwnedGamesResponse {
    response: {
      game_count: number;
      games: OwnedGame[];
    };
  }
  
  // Tipo para errores genéricos en la comunicación con la API
  export interface SteamServiceError {
    error: string;
  }
  