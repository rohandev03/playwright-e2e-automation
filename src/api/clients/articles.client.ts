import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.client.js';
import { APP_CONFIG } from '../../config/env.config.js';
import { ArticlePayload } from '../../models/article.model.js';

/**
 * Cliente de API para Artículos.
 * Hereda de BaseApiClient y gestiona endpoints de artículos aplicando DRY y tipado estricto.
 */
export class ArticlesClient extends BaseApiClient {
  /**
   * Crea un artículo por API utilizando un token JWT.
   * Soporta tanto sobrecarga por DTO/objeto como por parámetros posicionales.
   */
  async createArticle(token: string, payload: ArticlePayload): Promise<APIResponse>;
  async createArticle(
    token: string,
    title: string,
    description: string,
    body: string,
    tagList?: string[],
  ): Promise<APIResponse>;
  async createArticle(
    token: string,
    titleOrPayload: string | ArticlePayload,
    description?: string,
    body?: string,
    tagList: string[] = [],
  ): Promise<APIResponse> {
    const payload: ArticlePayload =
      typeof titleOrPayload === 'string'
        ? { title: titleOrPayload, description: description || '', body: body || '', tagList }
        : titleOrPayload;

    return this.request.post(APP_CONFIG.apiEndpoints.articles, {
      headers: this.getAuthHeaders(token),
      data: {
        article: payload,
      },
    });
  }

  /**
   * Elimina un artículo mediante su slug identificador.
   * @param token Token JWT del propietario
   * @param slug Identificador amigable de la URL del artículo
   */
  async deleteArticle(token: string, slug: string): Promise<APIResponse> {
    return this.request.delete(APP_CONFIG.apiEndpoints.articleBySlug(slug), {
      headers: this.getAuthHeaders(token),
    });
  }
}
