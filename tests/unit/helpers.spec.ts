import { test, expect } from '@playwright/test';
import { generateRandomUser, formatDate, sanitizeText } from '../../src/utils/helpers.js';

/**
 * NOTA EXPLICATIVA:
 * tests/unit/helpers.spec.ts - Pruebas Unitarias.
 *
 * Estas pruebas verifican la lógica pura de negocio o utilidades en aislamiento.
 * Al no interactuar con el navegador ni con APIs externas, se ejecutan de manera instantánea
 * y son el primer filtro en nuestras Quality Gates.
 */
test.describe('Pruebas Unitarias - Helpers de Utilidad', () => {
  test('Debería generar un usuario aleatorio con formato válido', () => {
    const user = generateRandomUser();

    // Validar que el usuario contenga valores definidos
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeDefined();

    // Validar formatos esperados
    expect(user.username).toContain('qa_');
    expect(user.email).toMatch(/^[a-zA-Z0-9._%+-]+@example\.com$/);
  });

  test('Debería formatear correctamente la fecha en formato YYYY-MM-DD', () => {
    const testDate = new Date(2026, 4, 20); // 20 de Mayo del 2026 (meses indexados desde 0)
    const formatted = formatDate(testDate);

    expect(formatted).toBe('2026-05-20');
  });

  test('Debería remover espacios innecesarios y saltos de línea al sanitizar texto', () => {
    const rawText = '   Texto    con\n múltiples   espacios   ';
    const sanitized = sanitizeText(rawText);

    expect(sanitized).toBe('Texto con múltiples espacios');
  });
});
