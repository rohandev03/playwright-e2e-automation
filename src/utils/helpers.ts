/**
 * NOTA EXPLICATIVA:
 * src/utils/helpers.ts - Utilidades generales compartidas.
 *
 * Este archivo contiene funciones puras de utilidad que no dependen de la interfaz de usuario de Playwright.
 * Al ser funciones aisladas, son excelentes candidatas para pruebas unitarias.
 * El uso de utilidades ayuda a mantener el código DRY (Don't Repeat Yourself).
 */

import type { TestUser } from '../models/user.model.js';
export type { TestUser } from '../models/user.model.js';

/**
 * Genera un usuario aleatorio único basado en timestamp.
 * Esto evita colisiones de nombres o correos al registrar cuentas en una aplicación pública de pruebas.
 */
export function generateRandomUser(): TestUser {
  // Combinamos los últimos 6 dígitos del timestamp con 4 dígitos aleatorios para evitar colisiones entre workers simultáneos (< 20 caracteres)
  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  const shortId = `${Date.now().toString().slice(-6)}${randomSuffix}`;
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
