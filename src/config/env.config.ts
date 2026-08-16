import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Carga de variables de entorno desde el archivo .env en la raíz del proyecto.
 */
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Objeto inmutable de configuración global de la aplicación.
 * Centraliza URLs, selectores de rutas y endpoints de API para asegurar el principio DRY.
 */
export const APP_CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://conduit.bondaracademy.com',
  apiUrl: process.env.API_URL || 'https://conduit-api.bondaracademy.com/api',
  get apiHost(): string {
    return this.apiUrl.endsWith('/api') ? this.apiUrl.slice(0, -4) : this.apiUrl;
  },
  timeouts: {
    short: 5000,
    standard: 15000,
    long: 30000,
  },
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    editor: '/editor',
    settings: '/settings',
    article: (slug: string) => `/article/${slug}`,
    profile: (username: string) => `/profile/${username}`,
  },
  apiEndpoints: {
    users: '/api/users',
    login: '/api/users/login',
    articles: '/api/articles',
    tags: '/api/tags',
    articleBySlug: (slug: string) => `/api/articles/${slug}`,
    commentsBySlug: (slug: string) => `/api/articles/${slug}/comments`,
  },
} as const;
