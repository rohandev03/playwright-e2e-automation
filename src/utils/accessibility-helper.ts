import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Helper reutilizable para auditorías de accesibilidad con Axe-core.
 * Centraliza la configuración de reglas WCAG y el formato de reporte de violaciones (DRY).
 *
 * @param page Instancia de la página de Playwright
 * @param contextName Nombre contextual para la auditoría (ej. 'Home', 'Login')
 * @param tags Etiquetas WCAG a evaluar (por defecto ['wcag2a', 'wcag2aa'])
 */
export async function runAccessibilityScan(
  page: Page,
  contextName: string,
  tags: string[] = ['wcag2a', 'wcag2aa'],
) {
  const scanResults = await new AxeBuilder({ page }).withTags(tags).analyze();

  if (scanResults.violations.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Accesibilidad] Se detectaron ${scanResults.violations.length} violaciones en ${contextName}:`,
      scanResults.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
      })),
    );
  }

  return scanResults;
}
