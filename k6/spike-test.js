import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, authenticateUser, thresholdsConfig } from './config.js';

/**
 * NOTA EXPLICATIVA:
 * k6/spike-test.js - Prueba de Picos (Spike Testing).
 *
 * Provoca un crecimiento abrupto y vertiginoso de la carga en un periodo de tiempo sumamente corto
 * (rampa a 150 VUs concurrentes en sólo 10 segundos).
 * Sirve para:
 * 1. Simular picos repentinos de tráfico (ej. campañas de marketing, lanzamientos).
 * 2. Comprobar si el backend sobrevive y si responde con lentitud aceptable o fallos de conexión.
 * 3. Evaluar la capacidad de autorecuperación del servidor cuando la carga desciende igual de rápido.
 */

export const options = {
  stages: [
    { duration: '10s', target: 150 }, // Incremento repentino a 150 VUs en 10s
    { duration: '20s', target: 150 }, // Mantener la avalancha de carga durante 20s
    { duration: '10s', target: 0 },  // Descenso inmediato a 0 VUs en 10s
  ],
  thresholds: thresholdsConfig
};

/**
 * Autenticación inicial y generación del token JWT.
 */
export function setup() {
  return authenticateUser();
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
