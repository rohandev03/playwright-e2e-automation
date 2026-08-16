import { test, expect } from '../../src/fixtures/test-base.js';
import { ArticlesFeedResponse } from '../../src/models/article.model.js';

/**
 * tests/ui/integration.spec.ts - Pruebas de Integración de UI (Mocking de Red).
 *
 * Aislamiento de frontend mediante interceptación y mockeo de API con page.route() y POM.
 */
test.describe('UI Integration Tests - Interceptación y Mocking de Peticiones', () => {
  test('Debería manejar correctamente un error 500 al cargar la lista de etiquetas', async ({
    page,
    homePage,
  }) => {
    await page.route('**/api/tags', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { body: ['Server Error Mock'] } }),
      });
    });

    await homePage.navigate();

    const tags = await homePage.getTags();
    expect(tags.length).toBe(0);
  });

  test('Debería renderizar la UI con una lista de artículos simulados (Mocking)', async ({
    page,
    homePage,
  }) => {
    const mockArticlesPayload: ArticlesFeedResponse = {
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

    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArticlesPayload),
      });
    });

    await homePage.navigate();
    await homePage.selectGlobalFeed();

    const titles = await homePage.getArticleTitles();
    expect(titles).toContain('Artículo de Prueba Mockeado');
  });
});
