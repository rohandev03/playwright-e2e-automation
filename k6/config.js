/**
 * NOTA EXPLICATIVA:
 * k6/config.js - Configuración compartida para las pruebas de rendimiento con K6.
 *
 * Centraliza las variables de entorno (URL de la API y credenciales de prueba)
 * y define los umbrales (Thresholds) exigidos por el negocio para marcar
 * los tests de performance como exitosos o fallidos.
 */

// Extrae variables de entorno pasadas en la ejecución de K6 (-e NOMBRE=valor) o usa valores por defecto
export const API_URL = __ENV.API_URL || 'https://conduit.bondaracademy.com/api';
export const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'qa_test_user_antigravity@mailinator.com';
export const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'QAtestpassword123!';

// Umbrales exigidos para pruebas de carga, stress y picos
export const thresholdsConfig = {
  // El 95% de las peticiones HTTP realizadas deben completarse en menos de 200ms
  'http_req_duration': ['p(95)<200'],
  // La tasa de errores de peticiones (ej. respuestas 5xx, 4xx que fallen) debe ser menor al 1%
  'http_req_failed': ['rate<0.01']
};
