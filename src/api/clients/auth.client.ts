import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * NOTA EXPLICATIVA:
 * src/api/clients/auth.client.ts - Cliente de API para Autenticación.
 *
 * Este controlador encapsula las llamadas HTTP rápidas hacia los endpoints de usuarios (/api/users).
 * Permite autenticarse o registrar nuevos usuarios directamente de forma asíncrona,
 * facilitando la preparación rápida de datos (seeding) y el bypass de Login en pruebas UI/E2E.
 */
export class AuthClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Realiza una petición POST para autenticar un usuario y obtener su token JWT.
   * @param email Correo electrónico
   * @param password Contraseña
   */
  async login(email: string, password: string): Promise<APIResponse> {
    return this.request.post('/api/users/login', {
      data: {
        user: { email, password },
      },
    });
  }

  /**
   * Realiza una petición POST para registrar un nuevo usuario único.
   * @param username Nombre de usuario único
   * @param email Correo electrónico único
   * @param password Contraseña
   */
  async register(username: string, email: string, password: string): Promise<APIResponse> {
    return this.request.post('/api/users', {
      data: {
        user: { username, email, password },
      },
    });
  }
}
