// types/steam-store.d.ts
// Tipos para Steam Store API (no requires API key)
// Incluye detalles de juegos, precios, información de la tienda

// Interfaz para la información de precios de Steam
export interface PriceOverview {
  currency: string;
  initial: number; // Precio inicial en la unidad monetaria más pequeña (ej. céntimos)
  final: number; // Precio final en la unidad monetaria más pequeña
  discount_percent: number;
  initial_formatted: string; // Precio inicial formateado con símbolo de moneda
  final_formatted: string; // Precio final formateado con símbolo de moneda
}

// Interfaz para los datos detallados de un juego de la API appdetails
export interface GameDetailsData {
  type?: string;
  name?: string;
  steam_appid?: number;
  required_age?: number | string;
  is_free?: boolean;
  controller_support?: string;
  dlc?: number[];
  detailed_description?: string;
  about_the_game?: string;
  short_description?: string;
  fullgame?: { appid: string; name: string };
  supported_languages?: string;
  header_image?: string;
  capsule_image?: string;
  capsule_imagev5?: string;
  website?: string | null;
  pc_requirements?: Record<string, any> | any[]; // Puede ser un objeto o un array vacío
  mac_requirements?: Record<string, any> | any[];
  linux_requirements?: Record<string, any> | any[];
  legal_notice?: string;
  drm_notice?: string;
  ext_user_account_notice?: string;
  developers?: string[];
  publishers?: string[];
  demos?: Array<{ appid: number; description: string }>;
  price_overview?: PriceOverview;
  packages?: number[];
  package_groups?: Array<{
    name: string;
    title: string;
    description: string;
    selection_text: string;
    save_text: string;
    display_type: number;
    is_recurring_subscription: string;
    subs: Array<{
      packageid: number;
      percent_savings_text: string;
      percent_savings: number;
      option_text: string;
      option_description: string;
      can_get_free_license: string;
      is_free_license: boolean;
      price_in_cents_with_discount: number;
    }>;
  }>;
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  categories?: Array<{
    id: number;
    description: string;
  }>;
  genres?: Array<{
    id: string; // Los IDs de género son strings
    description: string;
  }>;
  screenshots?: Array<{
    id: number;
    path_thumbnail: string;
    path_full: string;
  }>;
  movies?: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: { '480': string; max: string };
    mp4: { '480': string; max: string };
    highlight: boolean;
  }>;
  recommendations?: {
    total: number;
  };
  achievements?: {
    total: number;
    highlighted?: Array<{
      name: string;
      path: string;
    }>;
  };
  release_date?: {
    coming_soon: boolean;
    date: string; // Formato "30 Oct, 2013"
  };
  support_info?: {
    url: string;
    email: string;
  };
  background?: string; // URL imagen de fondo
  background_raw?: string; // URL imagen de fondo sin procesar
  content_descriptors?: {
    ids: number[];
    notes: string | null;
  };
}

// Interfaz para la respuesta de nuestra API /api/getAppDetails
// La clave es el appid como string
export interface AppDetailsResponse {
  [appid: string]: {
    success: boolean;
    data?: GameDetailsData; // Los datos del juego si success es true
    error?: string; // Mensaje de error si success es false
  };
}
