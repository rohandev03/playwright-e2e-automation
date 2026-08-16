import { authenticateUser, thresholdsConfig, simulateArticleFeed } from './config.js';

/**
 * k6/stress-test.js - Prueba de Estrés (Stress Testing).
 *
 * Incrementa progresivamente los usuarios virtuales a una cantidad muy superior a la normal (55 VUs).
 */
export const options = {
  stages: [
    { duration: '20s', target: 40 }, // Sube rápido a 40 VUs
    { duration: '30s', target: 55 }, // Forzar al sistema subiendo a 55 VUs
    { duration: '1m', target: 55 },  // Mantener esfuerzo en 55 VUs
    { duration: '20s', target: 0 },  // Rampa de salida a 0 usuarios
  ],
  thresholds: thresholdsConfig,
};

export function setup() {
  return authenticateUser();
}

export default function (data) {
  simulateArticleFeed(data);
}
