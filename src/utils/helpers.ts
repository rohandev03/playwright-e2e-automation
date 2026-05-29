/**
 * NOTA EXPLICATIVA:
 * src/utils/helpers.ts - Utilidades generales compartidas.
 *
 * Este archivo contiene funciones puras de utilidad que no dependen de la interfaz de usuario de Playwright.
 * Al ser funciones aisladas, son excelentes candidatas para pruebas unitarias.
 * El uso de utilidades ayuda a mantener el código DRY (Don't Repeat Yourself).
 */

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

/**
 * Genera un usuario aleatorio único basado en timestamp.
 * Esto evita colisiones de nombres o correos al registrar cuentas en una aplicación pública de pruebas.
 */
export function generateRandomUser(): TestUser {
  // Usamos los últimos 10 dígitos del timestamp para garantizar unicidad y mantenernos bajo el límite de 20 caracteres del backend.
  const shortId = Date.now().toString().slice(-10);
  return {
    username: `qa_${shortId}`,
    email: `qa_${shortId}@example.com`,
    password: `P_${shortId}!`,
  };
}

/**
 * Formatea un objeto de fecha en un string legible con formato (YYYY-MM-DD).
 * @param date Objeto Date a formatear
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Limpia y recorta una cadena de texto, removiendo espacios adicionales y caracteres especiales comunes.
 * Útil para limpiar entradas en campos del formulario.
 * @param text Cadena a sanitizar
 */
export function sanitizeText(text: string): string {
  return text.trim().replace(/[\s\t\n]+/g, ' ');
}
