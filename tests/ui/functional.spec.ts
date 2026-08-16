import { test, expect } from '../../src/fixtures/test-base.js';

/**
 * tests/ui/functional.spec.ts - Pruebas UI Funcionales (Edge & Boundary Cases).
 *
 * Valida comportamientos límite y casos borde usando métodos de intención de POM.
 */
test.describe('UI Functional Tests - Escenarios Edge & Boundary', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Límite (Boundary): No debería iniciar sesión con campos de credenciales vacíos', async ({
    loginPage,
  }) => {
    await loginPage.clearForm();
    await expect(loginPage.signInButton).toBeDisabled();
  });

  test('Caso de Borde (Edge): No debería iniciar sesión con formato de correo electrónico inválido', async ({
    loginPage,
  }) => {
    await loginPage.login('correo_sin_formato', 'ClaveSegura123!');

    const errors = await loginPage.getErrorMessages();

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
    await loginPage.login({
      email: 'no_existe_usuario_qa_antigravity@mailinator.com',
      password: 'NoExistePassword999!',
    });

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
