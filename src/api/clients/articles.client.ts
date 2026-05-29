import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * NOTA EXPLICATIVA:
 * src/api/clients/articles.client.ts - Cliente de API para Artículos.
 *
 * Este controlador expone métodos rápidos para crear y eliminar artículos mediante llamadas HTTP.
 * Requiere el token JWT en las cabeceras (headers) para autenticar las peticiones.
 * Se utiliza para la preparación veloz de datos antes de las pruebas UI.
 */
export class ArticlesClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Crea un artículo por API utilizando un token JWT.
   * @param token Token JWT del usuario creador
   * @param title Título del artículo
   * @param description Breve descripción
   * @param body Contenido en markdown
   * @param tagList Lista de etiquetas (opcional)
   */
  async createArticle(
    token: string,
    title: string,
    description: string,
    body: string,
    tagList: string[] = [],
  ): Promise<APIResponse> {
    return this.request.post('/api/articles', {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        article: { title, description, body, tagList },
      },
    });
  }

  /**
   * Elimina un artículo mediante su slug identificador.
   * @param token Token JWT del propietario
   * @param slug Identificador amigable de la URL del artículo
   */
  async deleteArticle(token: string, slug: string): Promise<APIResponse> {
    return this.request.delete(`/api/articles/${slug}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  }
}
