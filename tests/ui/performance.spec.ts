import { test, expect } from '../../src/fixtures/test-base.js';
import { getPerformanceMetrics } from '../../src/utils/performance-helper.js';

/**
 * NOTA EXPLICATIVA:
 * tests/ui/performance.spec.ts - Pruebas de Rendimiento Frontend.
 *
 * Utiliza el performance-helper para obtener las métricas del navegador
 * y valida los resultados contra límites (thresholds) aceptables
 * para evitar degradaciones en la experiencia de usuario.
 */
test.describe('UI Frontend Performance - Core Web Vitals', () => {
  test('Debería medir y validar rendimiento en la página de Home', async ({ page, homePage }) => {
    await homePage.navigate();

    // Captura de métricas
    const metrics = await getPerformanceMetrics(page);

    // eslint-disable-next-line no-console
    console.log(`[Rendimiento - Home]:`, JSON.stringify(metrics, null, 2));

    // Aserciones: validamos límites de rendimiento frontend comunes (en milisegundos)
    // El TTFB (Tiempo al primer byte) idealmente debe ser menor a 800ms
    expect(metrics.ttfb).toBeLessThan(800);
    // El FCP (Primer pintado de contenido) idealmente debe ser menor a 2500ms
    expect(metrics.fcp).toBeLessThan(2500);
  });

  test('Debería medir y validar rendimiento en la página de Login', async ({ page, loginPage }) => {
    await loginPage.navigate();

    const metrics = await getPerformanceMetrics(page);

    // eslint-disable-next-line no-console
    console.log(`[Rendimiento - Login]:`, JSON.stringify(metrics, null, 2));

    expect(metrics.ttfb).toBeLessThan(800);
    expect(metrics.fcp).toBeLessThan(2500);
  });
});
