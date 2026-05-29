import { test, expect } from '../../src/fixtures/test-base.js';

/**
 * NOTA EXPLICATIVA:
 * tests/ui/integration.spec.ts - Pruebas de Integración de UI (Mocking de Red).
 *
 * Estas pruebas demuestran el aislamiento del frontend mediante el interceptado y mockeo
 * de llamadas API usando 'page.route()' de Playwright.
 * Nos permiten:
 * 1. Probar cómo reacciona la UI si el servidor falla (ej. error 500).
 * 2. Cargar listas de artículos controladas (mockeadas) de forma inmediata, sin depender
 *    del estado real de la base de datos de producción/desarrollo.
 */
test.describe('UI Integration Tests - Interceptación y Mocking de Peticiones', () => {
  test('Debería manejar correctamente un error 500 al cargar la lista de etiquetas', async ({
    page,
    homePage,
  }) => {
    // Interceptamos la llamada GET a '/api/tags' y forzamos una respuesta de servidor caído (500)
    await page.route('**/api/tags', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { body: ['Server Error Mock'] } }),
      });
    });

    // Navegar a la Home
    await homePage.navigate();

    // Validamos que el lister de tags populares en el sidebar esté vacío debido al error mockeado
    const tags = await homePage.tagList.allInnerTexts();
    expect(tags.length).toBe(0);
  });

  test('Debería renderizar la UI con una lista de artículos simulados (Mocking)', async ({
    page,
    homePage,
  }) => {
    const mockArticlesPayload = {
      articles: [
        {
          slug: 'articulo-mock-1',
          title: 'Artículo de Prueba Mockeado',
          description: 'Esta descripción se inyectó interceptando la red por Playwright.',
          body: 'Contenido del artículo de integración.',
          tagList: ['mock', 'integration-testing'],
          createdAt: '2026-05-20T12:00:00.000Z',
          updatedAt: '2026-05-20T12:00:00.000Z',
          favorited: false,
          favoritesCount: 15,
          author: {
            username: 'TesterSimulado',
            bio: 'Bio del mock',
            image: 'https://api.realworld.io/images/demo-avatar.png',
            following: false,
          },
        },
      ],
      articlesCount: 1,
    };

    // Interceptamos cualquier petición que intente buscar artículos
    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArticlesPayload),
      });
    });

    // Navegar y activar la pestaña de Feed Global
    await homePage.navigate();
    await homePage.selectGlobalFeed();

    // Verificamos que el título renderizado en la UI sea exactamente el que mockeamos
    const titles = await homePage.getArticleTitles();
    expect(titles).toContain('Artículo de Prueba Mockeado');
  });
});
