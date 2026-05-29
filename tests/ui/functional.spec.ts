import { test, expect } from '../../src/fixtures/test-base.js';

/**
 * NOTA EXPLICATIVA:
 * tests/ui/functional.spec.ts - Pruebas UI Funcionales (Edge & Boundary Cases).
 *
 * Estas pruebas validan el comportamiento del frontend y backend frente a flujos anormales,
 * entradas inválidas y límites del sistema (por ejemplo, validaciones de formularios).
 * Se hace uso estricto del Page Object Model sin locators inline.
 */
test.describe('UI Functional Tests - Escenarios Edge & Boundary', () => {
  // Antes de cada prueba, nos aseguramos de navegar directamente a la página de Login
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Límite (Boundary): No debería iniciar sesión con campos de credenciales vacíos', async ({
    loginPage,
  }) => {
    // Rellenamos con datos vacíos y comprobamos que el botón de envío permanece deshabilitado
    await loginPage.emailInput.fill('');
    await loginPage.passwordInput.fill('');
    await expect(loginPage.signInButton).toBeDisabled();
  });

  test('Caso de Borde (Edge): No debería iniciar sesión con formato de correo electrónico inválido', async ({
    loginPage,
  }) => {
    // Proveemos un correo sin formato de e-mail ('@' o dominio)
    await loginPage.login('correo_sin_formato', 'ClaveSegura123!');

    const errors = await loginPage.getErrorMessages();

    // El backend/frontend debe advertir que el correo es inválido
    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.some(
        (msg) => msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('email'),
      ),
    ).toBeTruthy();
  });

  test('Límite (Boundary): No debería iniciar sesión con usuario inexistente', async ({
    loginPage,
  }) => {
    // Proveemos credenciales válidas en estructura pero no registradas
    await loginPage.login(
      'no_existe_usuario_qa_antigravity@mailinator.com',
      'NoExistePassword999!',
    );

    const errors = await loginPage.getErrorMessages();

    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.some(
        (msg) =>
          msg.toLowerCase().includes('invalid') ||
          msg.toLowerCase().includes('not found') ||
          msg.toLowerCase().includes('password'),
      ),
    ).toBeTruthy();
  });
});
