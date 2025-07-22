// types/steam.d.ts
// Barrel export para mantener compatibilidad con imports existentes
// Re-exporta todos los tipos de Steam de archivos específicos

// Steam Web API Types (usuarios, perfiles, juegos poseídos)
export type {
  Player,
  PlayerSummariesResponse,
  OwnedGame,
  OwnedGamesResponse,
  ResolveVanityURLResponse
} from './steam-webapi'

// Steam Store API Types (detalles de juegos, precios)
export type {
  PriceOverview,
  GameDetailsData,
  AppDetailsResponse
} from './steam-store'



// Tipos generales para todas las APIs de Steam
export interface SteamServiceError {
  error: string;
  details?: string;
  timestamp?: string;
}

// Tipos de utilidades comunes
export type SteamAppID = number
export type SteamID64 = string

// Enums útiles
export enum SteamPersonaState {
  Offline = 0,
  Online = 1,
  Busy = 2,
  Away = 3,
  Snooze = 4,
  LookingToTrade = 5,
  LookingToPlay = 6
}

export enum SteamCommunityVisibilityState {
  Private = 1,
  FriendsOnly = 2,
  Public = 3
}
  