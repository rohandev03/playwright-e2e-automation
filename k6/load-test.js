import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, authenticateUser, getHeaders, thresholdsConfig } from './config.js';

/**
 * NOTA EXPLICATIVA:
 * k6/load-test.js - Prueba de Carga en Backend.
 *
 * Simula el comportamiento de múltiples usuarios reales que acceden
 * de forma concurrente en condiciones típicas de producción (hasta 100 usuarios virtuales).
 * Reutiliza las credenciales globales y valida que los tiempos de respuesta cumplan con
 * los umbrales exigidos (p95 < 500ms y fallos < 1%).
 */

export const options = {
  // Definición de las etapas de carga (Ramp-up, Hold, Ramp-down)
  stages: [
    { duration: '20s', target: 100 }, // Ramp-up: Sube de 0 a 100 usuarios concurrentes en 20s
    { duration: '40s', target: 100 }, // Hold: Mantiene la carga constante en 100 usuarios por 40s
    { duration: '20s', target: 0 },  // Ramp-down: Baja de 100 a 0 usuarios en 20s
  ],
  // Inyección de los umbrales de aceptación comunes
  thresholds: thresholdsConfig
};

/**
 * Se ejecuta una sola vez al inicio del test de rendimiento.
 * Inicia sesión vía API y expone el token de sesión a todos los usuarios virtuales (VUs).
 */
export function setup() {
  return authenticateUser();
}

/**
 * Lógica iterativa ejecutada por cada VU (Virtual User) concurrente.
 */
export default function (data) {
  const feedUrl = `${API_URL}/articles?limit=10&offset=0`;
  const params = {
    headers: getHeaders(data.token)
  };

  const response = http.get(feedUrl, params);

  // Validaciones durante la prueba de carga
  check(response, {
    'Estado HTTP es 200': (r) => r.status === 200,
    'Lista de artículos disponible': (r) => r.json().articles !== undefined,
  });

  // Simulación de "tiempo de pensamiento" del usuario real de 1 segundo
  sleep(1);
}
