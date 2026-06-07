/**
 * NOTA EXPLICATIVA:
 * k6/config.js - Configuración compartida para las pruebas de rendimiento con K6.
 *
 * Centraliza las variables de entorno (URL de la API y credenciales de prueba)
 * y define los umbrales (Thresholds) exigidos por el negocio para marcar
 * los tests de performance como exitosos o fallidos.
 */

import http from 'k6/http';
import { check } from 'k6';

// Extrae variables de entorno pasadas en la ejecución de K6 (-e NOMBRE=valor) o usa valores por defecto
export const API_URL = __ENV.API_URL || 'https://conduit.bondaracademy.com/api';
export const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'qa_test_user_antigravity@mailinator.com';
export const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'QAtestpassword123!';
export const TEST_USER_USERNAME = __ENV.TEST_USER_USERNAME || 'qa_test_user_antigravity';

// Umbrales exigidos para pruebas de carga, stress y picos
export const thresholdsConfig = {
  // El 95% de las peticiones HTTP realizadas deben completarse en menos de 200ms
  'http_req_duration': ['p(95)<200'],
  // La tasa de errores de peticiones (ej. respuestas 5xx, 4xx que fallen) debe ser menor al 1%
  'http_req_failed': ['rate<0.01']
};

/**
 * Autentica o registra al usuario de pruebas (Estrategia Self-Healing / Upsert)
 * para asegurar la disponibilidad del token antes de iniciar las pruebas de carga.
 */
export function authenticateUser() {
  const headers = { 'Content-Type': 'application/json' };
  
  // 1. Intentamos registrar al usuario de pruebas en caso de que la base de datos se haya reseteado
  const registerUrl = `${API_URL}/users`;
  const registerPayload = JSON.stringify({
    user: {
      username: TEST_USER_USERNAME,
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }
  });

  let res = http.post(registerUrl, registerPayload, { headers });
  let token = '';

  if (res.status === 201) {
    const body = res.json();
    token = body && body.user ? body.user.token : '';
  } else {
    // 2. Si ya existe (422) o falla por otra razón, intentamos login directo con las credenciales estáticas
    const loginUrl = `${API_URL}/users/login`;
    const loginPayload = JSON.stringify({
      user: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD }
    });
    res = http.post(loginUrl, loginPayload, { headers });

    if (res.status === 200) {
      const body = res.json();
      token = body && body.user ? body.user.token : '';
    }
  }

  // 3. Estrategia de Fallback Dinámico: Si falló tanto el registro como el login estático,
  // procedemos a registrar un usuario con credenciales únicas aleatorias para no detener las pruebas de carga.
  if (!token) {
    // eslint-disable-next-line no-console
    console.warn('Advertencia: Las credenciales estáticas fallaron. Intentando registro de usuario temporal (Fallback)...');
    
    const uniqueId = Math.floor(Math.random() * 100000000);
    const uniqueUsername = `${TEST_USER_USERNAME}_${uniqueId}`;
    const uniqueEmail = `qa_test_user_${uniqueId}@mailinator.com`;
    const uniquePayload = JSON.stringify({
      user: {
        username: uniqueUsername,
        email: uniqueEmail,
        password: TEST_USER_PASSWORD
      }
    });

    res = http.post(registerUrl, uniquePayload, { headers });

    const body = res.json();
    token = body && body.user ? body.user.token : '';
  }

  // Validación final para confirmar que obtuvimos un token, garantizando que el resto del test pueda proceder
  check(res, {
    'Setup: Autenticación completada con éxito': () => token !== '',
  });

  return { token };
}

