import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD, thresholdsConfig } from './config.js';

/**
 * NOTA EXPLICATIVA:
 * k6/stress-test.js - Prueba de Estrés (Stress Testing).
 *
 * Incrementa progresivamente los usuarios virtuales a una cantidad muy superior a la normal
 * (hasta 100 VUs concurrentes) con el objetivo de:
 * 1. Comprobar si el sistema se degrada de forma controlada o sufre caídas catastróficas.
 * 2. Comprobar si el backend se recupera tras el pico máximo de demanda.
 * 3. Validar si bajo condiciones de alta demanda se logran cumplir los umbrales de servicio.
 */

export const options = {
  stages: [
    { duration: '20s', target: 50 }, // Sube rápido a 50 VUs
    { duration: '30s', target: 100 }, // Forzar al sistema subiendo a 100 VUs
    { duration: '1m', target: 100 },  // Mantener el esfuerzo máximo en 100 VUs
    { duration: '20s', target: 0 },  // Rampa de salida a 0 usuarios
  ],
  thresholds: thresholdsConfig
};

/**
 * Autenticación inicial y generación del token JWT.
 */
export function setup() {
  const loginUrl = `${API_URL}/users/login`;
  const payload = JSON.stringify({
    user: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD }
  });
  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(loginUrl, payload, { headers });

  check(res, {
    'Setup: Login completado con éxito (200)': (r) => r.status === 200,
  });

  const body = res.json();
  const token = body && body.user ? body.user.token : '';
  return { token };
}

/**
 * Iteración de cada usuario virtual.
 */
export default function (data) {
  const feedUrl = `${API_URL}/articles?limit=10&offset=0`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${data.token}`
    }
  };

  const response = http.get(feedUrl, params);

  check(response, {
    'Estado HTTP es 200': (r) => r.status === 200,
  });

  sleep(1);
}
