/**
 * k6/config.js - Configuración compartida y helpers para pruebas de rendimiento con K6.
 *
 * Centraliza variables de entorno, umbrales y la lógica común de simulación de usuarios virtuales (DRY).
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Extrae variables de entorno pasadas en la ejecución de K6 (-e NOMBRE=valor) o usa valores por defecto
export const API_URL = __ENV.API_URL || 'https://conduit-api.bondaracademy.com/api';
export const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'qa_antigravity@mailinator.com';
export const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'QAtestpassword123!';
export const TEST_USER_USERNAME = __ENV.TEST_USER_USERNAME || 'qa_antigravity';

export const thresholdsConfig = {
  // El 95% de las peticiones HTTP realizadas deben completarse en menos de 5000ms
  'http_req_duration': ['p(95)<5000'],
  // La tasa de errores de peticiones (ej. respuestas 5xx, 4xx que fallen) debe ser menor al 1%
  'http_req_failed': ['rate<0.01']
};

/**
 * Retorna las cabeceras HTTP estándar simulando un navegador real para evitar bloqueos.
 */
export function getHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

/**
 * Autentica al usuario de pruebas registrando un usuario temporal único por sesión de prueba.
 * Garantiza obtención inmediata del token JWT en una sola petición limpia (201 Created).
 */
export function authenticateUser() {
  const headers = getHeaders();
  const registerUrl = `${API_URL}/users`;
  const uniqueId = `${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
  const username = `qa_${uniqueId}`;
  const email = `qa_${uniqueId}@mailinator.com`;
  const password = TEST_USER_PASSWORD;

  const registerPayload = JSON.stringify({
    user: {
      username,
      email,
      password,
    },
  });

  const res = http.post(registerUrl, registerPayload, { headers });
  let token = '';

  if (res.status === 201) {
    const body = res.json();
    token = body && body.user ? body.user.token : '';
  }

  check(res, {
    'Setup: Autenticación completada con éxito': () => token !== '',
  });

  return { token };
}

/**
 * Función reutilizable que simula la interacción de un usuario virtual consultando el feed (DRY).
 * @param {{ token: string }} data Datos retornados por el bloque setup
 */
export function simulateArticleFeed(data) {
  const feedUrl = `${API_URL}/articles?limit=10&offset=0`;
  const params = {
    headers: getHeaders(data.token)
  };

  const response = http.get(feedUrl, params);

  check(response, {
    'Estado HTTP es 200': (r) => r.status === 200,
    'Lista de artículos disponible': (r) => {
      if (r.status !== 200) return false;
      try {
        const body = r.json();
        return body && body.articles !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}
