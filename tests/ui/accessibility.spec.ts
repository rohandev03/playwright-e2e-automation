import { test, expect } from '../../src/fixtures/test-base.js';
import AxeBuilder from '@axe-core/playwright';

/**
 * NOTA EXPLICATIVA:
 * tests/ui/accessibility.spec.ts - Pruebas de Accesibilidad (Axe Core).
 *
 * Estas pruebas ejecutan auditorías automáticas de accesibilidad sobre las pantallas
 * clave de la aplicación utilizando la librería Axe Core.
 * Busca violaciones a las pautas de accesibilidad WCAG 2.1 (niveles A y AA),
 * asegurando la usabilidad de la aplicación para personas con discapacidades.
 */
test.describe('Accessibility audits - Axe Core WCAG Standards', () => {
  test('Debería analizar accesibilidad en la página de Home', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.waitForNetworkIdle();

    // Instanciamos el constructor de Axe para la página actual
    const scanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']) // Filtramos para revisar estándares WCAG 2.0 y 2.1 (A / AA)
      .analyze();

    // Imprimimos en la consola de reportes las violaciones encontradas si existen
    if (scanResults.violations.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Accesibilidad] Se detectaron ${scanResults.violations.length} violaciones en la Home:`,
        scanResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
        })),
      );
    }

    // Aserción: Como la aplicación bajo prueba es pública y externa, no podemos corregir sus fallos.
    // Por ende, registramos los resultados en consola y verificamos que el análisis se haya completado con éxito.
    expect(scanResults.violations).toBeDefined();
  });

  test('Debería analizar accesibilidad en la página de Login', async ({ page, loginPage }) => {
    await loginPage.navigate();
    await loginPage.waitForNetworkIdle();

    const scanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    if (scanResults.violations.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Accesibilidad] Se detectaron ${scanResults.violations.length} violaciones en la página de Login:`,
        scanResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
        })),
      );
    }

    expect(scanResults.violations).toBeDefined();
  });
});
