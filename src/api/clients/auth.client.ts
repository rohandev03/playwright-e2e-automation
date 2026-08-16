import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.client.js';
import { APP_CONFIG } from '../../config/env.config.js';
import { UserCredentials, UserRegisterPayload } from '../../models/user.model.js';

/**
 * Cliente de API para Autenticación y Gestión de Usuarios.
 * Hereda de BaseApiClient y utiliza rutas centralizadas y modelos fuertemente tipados.
 */
export class AuthClient extends BaseApiClient {
  /**
   * Realiza una petición POST para autenticar un usuario y obtener su token JWT.
   * @param email Correo electrónico
   * @param password Contraseña
   */
  async login(email: string, password: string): Promise<APIResponse>;
  async login(credentials: UserCredentials): Promise<APIResponse>;
  async login(
    emailOrCredentials: string | UserCredentials,
    password?: string,
  ): Promise<APIResponse> {
    const payload =
      typeof emailOrCredentials === 'string'
        ? { email: emailOrCredentials, password: password || '' }
        : emailOrCredentials;

    return this.request.post(APP_CONFIG.apiEndpoints.login, {
      headers: this.getAuthHeaders(),
      data: {
        user: payload,
      },
    });
  }

  /**
   * Realiza una petición POST para registrar un nuevo usuario único.
   * @param username Nombre de usuario único
   * @param email Correo electrónico único
   * @param password Contraseña
   */
  async register(username: string, email: string, password: string): Promise<APIResponse>;
  async register(payload: UserRegisterPayload): Promise<APIResponse>;
  async register(
    usernameOrPayload: string | UserRegisterPayload,
    email?: string,
    password?: string,
  ): Promise<APIResponse> {
    const payload =
      typeof usernameOrPayload === 'string'
        ? { username: usernameOrPayload, email: email || '', password: password || '' }
        : usernameOrPayload;

    return this.request.post(APP_CONFIG.apiEndpoints.users, {
      headers: this.getAuthHeaders(),
      data: {
        user: payload,
      },
    });
  }
}
