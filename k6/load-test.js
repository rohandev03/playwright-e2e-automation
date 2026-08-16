import { authenticateUser, thresholdsConfig, simulateArticleFeed } from './config.js';

/**
 * k6/load-test.js - Prueba de Carga en Backend.
 *
 * Simula el comportamiento de múltiples usuarios concurrentes en condiciones típicas.
 */
export const options = {
  stages: [
    { duration: '20s', target: 20 }, // Ramp-up: Sube a 20 usuarios en 20s
    { duration: '40s', target: 20 }, // Hold: Mantiene 20 usuarios por 40s
    { duration: '20s', target: 0 },  // Ramp-down: Baja a 0 usuarios en 20s
  ],
  thresholds: thresholdsConfig,
};

export function setup() {
  return authenticateUser();
}

export default function (data) {
  simulateArticleFeed(data);
}
