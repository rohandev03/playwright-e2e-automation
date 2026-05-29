import { APIRequestContext } from '@playwright/test';
import { AuthClient } from './clients/auth.client.js';
import { ArticlesClient } from './clients/articles.client.js';

/**
 * NOTA EXPLICATIVA:
 * src/api/api-manager.ts - Orquestador y Gestor Central de APIs.
 *
 * En lugar de instanciar cada cliente de API individualmente en los tests,
 * el ApiManager recibe el contexto de petición ('APIRequestContext') y expone
 * los sub-clientes (auth, articles). Esto proporciona un único punto de entrada
 * para todas las interacciones de API, mejorando la mantenibilidad y escalabilidad.
 */
export class ApiManager {
  public readonly auth: AuthClient;
  public readonly articles: ArticlesClient;

  constructor(request: APIRequestContext) {
    // Se inicializan los clientes inyectándoles el contexto común
    this.auth = new AuthClient(request);
    this.articles = new ArticlesClient(request);
  }
}
