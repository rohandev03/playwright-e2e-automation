import { Page } from '@playwright/test';

/**
 * NOTA EXPLICATIVA:
 * src/utils/performance-helper.ts - Capturador de Métricas de Rendimiento Frontend.
 *
 * De acuerdo a los requerimientos:
 * Captura las métricas de rendimiento web (Core Web Vitals y tiempos clave) evaluando
 * el objeto nativo 'performance' del navegador en el contexto de ejecución de la página.
 * Funciona de manera multiplataforma/cross-browser.
 */

export interface FrontendPerformanceMetrics {
  ttfb: number; // Time To First Byte (Tiempo al primer byte de respuesta)
  domContentLoaded: number; // Tiempo hasta que el DOM está completamente construido
  loadTime: number; // Tiempo total de carga de la página
  fcp: number; // First Contentful Paint (Primer renderizado de contenido)
}

/**
 * Extrae las métricas de rendimiento actuales del objeto window.performance del navegador.
 * @param page Instancia de la página de Playwright
 */
export async function getPerformanceMetrics(page: Page): Promise<FrontendPerformanceMetrics> {
  // Aseguramos que la página haya completado su ciclo de carga de red y recursos
  await page.waitForLoadState('load');

  const metrics = await page.evaluate(() => {
    // Obtenemos los registros de navegación del navegador
    const navigationEntry = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming;
    // Obtenemos los registros de renderizado
    const paintEntries = performance.getEntriesByType('paint');

    const ttfb = navigationEntry ? navigationEntry.responseStart - navigationEntry.requestStart : 0;
    const domContentLoaded = navigationEntry
      ? navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime
      : 0;
    const loadTime = navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.startTime : 0;

    let fcp = 0;
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      fcp = fcpEntry.startTime;
    }

    return {
      ttfb: Math.round(ttfb),
      domContentLoaded: Math.round(domContentLoaded),
      loadTime: Math.round(loadTime),
      fcp: Math.round(fcp),
    };
  });

  return metrics;
}
