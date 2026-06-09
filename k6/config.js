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
export const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL || 'qa_antigravity@mailinator.com';
export const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD || 'QAtestpassword123!';
export const TEST_USER_USERNAME = __ENV.TEST_USER_USERNAME || 'qa_antigravity';

export const thresholdsConfig = {
  // El 95% de las peticiones HTTP realizadas deben completarse en menos de 500ms
  'http_req_duration': ['p(95)<500'],
  // La tasa de errores de peticiones (ej. respuestas 5xx, 4xx que fallen) debe ser menor al 1%
  'http_req_failed': ['rate<0.01']
};

/**
 * Retorna las cabeceras HTTP estándar simulando un navegador real para evitar bloqueos por rate limits o WAF.
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
 * Autentica o registra al usuario de pruebas (Estrategia Self-Healing / Upsert)
 * para asegurar la disponibilidad del token antes de iniciar las pruebas de carga.
 */
export function authenticateUser() {
  const headers = getHeaders();
  const loginUrl = `${API_URL}/users/login`;
  const registerUrl = `${API_URL}/users`;
  let token = '';
  let res;

  // 1. Intentamos login directo con las credenciales estáticas
  const loginPayload = JSON.stringify({
    user: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD }
  });
  res = http.post(loginUrl, loginPayload, { headers });

  if (res.status === 200) {
    const body = res.json();
    token = body && body.user ? body.user.token : '';
  } else {
    // 2. Si el login falla (ej. la base de datos se reinició y el usuario no existe), intentamos registrar al usuario estático
    let usernameToRegister = TEST_USER_USERNAME;
    if (usernameToRegister.length > 20) {
      usernameToRegister = usernameToRegister.slice(0, 20);
    }
    const registerPayload = JSON.stringify({
      user: {
        username: usernameToRegister,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD
      }
    });
    res = http.post(registerUrl, registerPayload, { headers });

    if (res.status === 201) {
      const body = res.json();
      token = body && body.user ? body.user.token : '';
    }
  }

  // 3. Estrategia de Fallback Dinámico: Si falló tanto el login como el registro del usuario estático,
  // procedemos a registrar un usuario con credenciales únicas aleatorias de longitud segura (< 20 caracteres).
  if (!token) {
    // eslint-disable-next-line no-console
    console.warn('Advertencia: Las credenciales estáticas fallaron. Intentando registro de usuario temporal (Fallback)...');

    const uniqueId = Math.floor(Math.random() * 1000000); // 6 dígitos
    const uniqueUsername = `usr_${uniqueId}`; // 10 caracteres (seguro, < 20)
    const uniqueEmail = `qa_usr_${uniqueId}@mailinator.com`;
    const uniquePayload = JSON.stringify({
      user: {
        username: uniqueUsername,
        email: uniqueEmail,
        password: TEST_USER_PASSWORD
      }
    });

    res = http.post(registerUrl, uniquePayload, { headers });

    if (res.status === 201) {
      const body = res.json();
      token = body && body.user ? body.user.token : '';
    }
  }

  // Validación final para confirmar que obtuvimos un token, garantizando que el resto del test pueda proceder
  check(res, {
    'Setup: Autenticación completada con éxito': () => token !== '',
  });

  return { token };
}

