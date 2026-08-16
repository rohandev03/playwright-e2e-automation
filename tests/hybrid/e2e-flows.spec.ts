import { test, expect } from '../../src/fixtures/test-base.js';
import { generateRandomUser, TestUser } from '../../src/utils/helpers.js';
import { APP_CONFIG } from '../../src/config/env.config.js';

/**
 * Pruebas Híbridas (E2E) con Seeding API y bypass UI.
 *
 * Aplica estándares POM, POO y DRY:
 * 1. Seeding y Cleanup rápidos por API.
 * 2. Inyección de sesión vía BasePage.setAuthSession() (Bypass UI login).
 * 3. Interacción UI mediante Page Objects semánticos.
 */
test.describe('Hybrid E2E Flows - Seeding API + Validación UI', () => {
  let testUser: TestUser;
  let userToken: string;

  // Pre-condición rápida: Registrar al usuario por API antes de comenzar los tests de UI
  test.beforeAll(async ({ playwright }) => {
    testUser = generateRandomUser();

    const apiContext = await playwright.request.newContext({
      baseURL: APP_CONFIG.apiHost,
    });

    const response = await apiContext.post(APP_CONFIG.apiEndpoints.users, {
      data: {
        user: {
          username: testUser.username,
          email: testUser.email,
          password: testUser.password,
        },
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    userToken = body.user.token;

    await apiContext.dispose();
  });

  test('Debería publicar un comentario en un artículo de forma híbrida', async ({
    basePage,
    api,
    articlePage,
    homePage,
  }) => {
    const articleTitle = `Artículo Híbrido E2E - ${Date.now()}`;
    let articleSlug = '';

    await test.step('1. Pre-condición: Crear artículo de forma rápida vía API (Seeding)', async () => {
      const response = await api.articles.createArticle(userToken, {
        title: articleTitle,
        description: 'Resumen del artículo de prueba híbrido',
        body: 'Contenido largo del cuerpo del artículo creado por API para optimizar el test.',
        tagList: ['seeding', 'hybrid', 'playwright'],
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      articleSlug = body.article.slug;
    });

    await test.step('2. Bypass Login UI: Inyectar sesión mediante BasePage helper (DRY)', async () => {
      // Inyección de token centralizada en BasePage
      await basePage.setAuthSession(userToken);

      // Comprobar que el navbar refleja la sesión del usuario mediante Component Object
      await expect(homePage.navbar.getUserProfile(testUser.username)).toBeVisible();
    });

    await test.step('3. Interacción UI: Navegar al artículo y agregar un comentario', async () => {
      // Navegación directa al artículo mediante POM
      await articlePage.navigateToArticle(articleSlug);

      const commentContent = 'Comentario de gran valor de negocio testeado por la UI!';

      // Publicación de comentario vía POM
      await articlePage.postComment(commentContent);

      // Verificación en interfaz
      const comments = await articlePage.getComments();
      expect(comments).toContain(commentContent);
    });

    await test.step('4. Cleanup: Eliminar el artículo creado vía API para limpieza', async () => {
      const response = await api.articles.deleteArticle(userToken, articleSlug);
      expect([200, 204]).toContain(response.status());
    });
  });
});
