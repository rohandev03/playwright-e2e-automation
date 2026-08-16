import { test, expect } from '../src/fixtures/test-base.js';
import { APP_CONFIG } from '../src/config/env.config.js';

/**
 * Pruebas de Humo (Smoke Tests) - tests/smoke.spec.ts
 *
 * Valida rápidamente la disponibilidad de los puntos de entrada críticos
 * utilizando estrictamente el Page Object Model (POM) y fixtures personalizadas.
 */
test.describe('Smoke Tests - Verificación de Disponibilidad Crítica (100% POM)', () => {
  test('1. Validar disponibilidad de la Home Page y Navbar', async ({ page, homePage }) => {
    await homePage.navigate();

    // Validar el título del sitio
    await expect(page).toHaveTitle(/Conduit/i);

    // Validar visibilidad del Navbar usando Component Object
    await expect(homePage.navbar.homeLink).toBeVisible();

    // Validar banner principal
    await expect(homePage.bannerHeading).toHaveText('conduit');
  });

  test('2. Validar disponibilidad de la página de Sign In (Login)', async ({ loginPage }) => {
    await loginPage.navigate();

    // Verificar presencia del encabezado y botón de submit mediante POM
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('3. Validar disponibilidad de la página de Sign Up (Registro)', async ({ registerPage }) => {
    await registerPage.navigate();

    // Verificar presencia del encabezado y campos mediante POM
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.usernameInput).toBeVisible();
    await expect(registerPage.signUpButton).toBeVisible();
  });

  test('4. Validar conectividad de red con el backend de API', async ({ request }) => {
    const response = await request.get(`${APP_CONFIG.apiUrl}/articles?limit=5`);

    // Verificar que el servidor responde con 200 OK
    expect(response.status()).toBe(200);

    // Verificar la estructura básica de respuesta
    const data = await response.json();
    expect(data).toHaveProperty('articles');
    expect(Array.isArray(data.articles)).toBe(true);
  });
});
