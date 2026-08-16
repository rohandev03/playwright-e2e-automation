import { APIRequestContext } from '@playwright/test';

/**
 * Clase Base para Clientes de API REST.
 *
 * Aplica principios de POO (Herencia y Encapsulamiento) y DRY:
 * - Encapsula el contexto de petición ('APIRequestContext').
 * - Centraliza la construcción de cabeceras HTTP (Headers) con o sin token de autenticación.
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Construye un objeto de cabeceras HTTP estándar para las peticiones JSON.
   * @param token Token JWT opcional para endpoints protegidos.
   */
  protected getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }
}
