/**
 * Definición de modelos de dominio e interfaces fuertemente tipadas para Usuarios y Autenticación.
 */

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserData {
  id?: number;
  email: string;
  token: string;
  username: string;
  bio?: string | null;
  image?: string | null;
}

export interface UserResponse {
  user: UserData;
}
