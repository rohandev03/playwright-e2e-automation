import { test, expect } from '@playwright/test';

/**
 * NOTA EXPLICATIVA:
 * Pruebas de Humo (Smoke Tests) - tests/smoke.spec.ts
 *
 * Estas pruebas validan rápidamente los puntos de entrada críticos tanto de la UI como de la API.
 * Garantizan que los servicios del backend y las páginas principales de la UI estén en línea,
 * carguen correctamente y contengan los elementos base.
 * Al ejecutarse en pocos segundos, se integran en el pipeline de Pull Request.
 */
test.describe('Smoke Tests - Verificación de Disponibilidad Crítica', () => {
  test('1. Validar disponibilidad de la Home Page y Navbar', async ({ page }) => {
    await page.goto('/');

    // Validar el título del sitio
    await expect(page).toHaveTitle(/Conduit/i);

    // Validar la visibilidad de la barra de navegación (Navbar)
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();

    // Validar banner principal
    const bannerHeading = page.locator('.banner h1');
    await expect(bannerHeading).toHaveText('conduit');
  });

  test('2. Validar disponibilidad de la página de Sign In (Login)', async ({ page }) => {
    await page.goto('/login');

    // Verificar que el título de la página sea "Sign in"
    const heading = page.locator('h1.text-xs-center', { hasText: 'Sign in' });
    await expect(heading).toBeVisible();

    // Verificar presencia del botón de envío del formulario
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('3. Validar disponibilidad de la página de Sign Up (Registro)', async ({ page }) => {
    await page.goto('/register');

    // Verificar que el título de la página sea "Sign up"
    const heading = page.locator('h1.text-xs-center', { hasText: 'Sign up' });
    await expect(heading).toBeVisible();

    // Verificar que el campo "Username" esté presente en el formulario
    const usernameInput = page.locator('input[placeholder="Username"]');
    await expect(usernameInput).toBeVisible();
  });

  test('4. Validar conectividad de red con el backend de API', async ({ request }) => {
    const apiUrl = process.env.API_URL || 'https://conduit-api.bondaracademy.com/api';
    // Realizamos una llamada rápida para listar artículos públicos usando la URL del backend
    const response = await request.get(`${apiUrl}/articles?limit=5`);

    // Verificar que el servidor responde con 200 OK
    expect(response.status()).toBe(200);

    // Verificar la estructura básica de respuesta
    const data = await response.json();
    expect(data).toHaveProperty('articles');
    expect(Array.isArray(data.articles)).toBe(true);
  });
});
