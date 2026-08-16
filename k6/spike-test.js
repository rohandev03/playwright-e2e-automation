import { authenticateUser, thresholdsConfig, simulateArticleFeed } from './config.js';

/**
 * k6/spike-test.js - Prueba de Picos (Spike Testing).
 *
 * Provoca un crecimiento abrupto y vertiginoso de carga (40 VUs en 10s).
 */
export const options = {
  stages: [
    { duration: '10s', target: 40 }, // Incremento a 40 VUs en 10s
    { duration: '20s', target: 40 }, // Mantener 40 VUs por 20s
    { duration: '10s', target: 0 },  // Descenso inmediato a 0 VUs en 10s
  ],
  thresholds: thresholdsConfig,
};

export function setup() {
  return authenticateUser();
}

export default function (data) {
  simulateArticleFeed(data);
}
