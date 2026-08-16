import { test, expect } from '../../src/fixtures/test-base.js';
import { runAccessibilityScan } from '../../src/utils/accessibility-helper.js';

/**
 * Pruebas de Accesibilidad (Axe Core WCAG Standards).
 * Utiliza el helper centralizado runAccessibilityScan para auditorías reutilizables (DRY).
 */
test.describe('Accessibility audits - Axe Core WCAG Standards', () => {
  test('Debería analizar accesibilidad en la página de Home', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.waitForPageLoaded();

    const scanResults = await runAccessibilityScan(page, 'Home');
    expect(scanResults.violations).toBeDefined();
  });

  test('Debería analizar accesibilidad en la página de Login', async ({ page, loginPage }) => {
    await loginPage.navigate();
    await loginPage.waitForPageLoaded();

    const scanResults = await runAccessibilityScan(page, 'Login');
    expect(scanResults.violations).toBeDefined();
  });
});
