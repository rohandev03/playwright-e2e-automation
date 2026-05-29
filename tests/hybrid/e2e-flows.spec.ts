import { test, expect } from '../../src/fixtures/test-base.js';
import { generateRandomUser } from '../../src/utils/helpers.js';

/**
 * NOTA EXPLICATIVA:
 * tests/hybrid/e2e-flows.spec.ts - Pruebas Híbridas (E2E) con Seeding API y bypass UI.
 *
 * De acuerdo a los requerimientos:
 * 1. La preparación del entorno (seeding) y limpieza (cleanup) se realizan mediante llamadas API rápidas.
 * 2. Se inyecta el token de autenticación JWT directamente en el localStorage del navegador,
 *    haciendo bypass del formulario de login de la UI, ahorrando valiosos segundos.
 * 3. La UI se reserva exclusivamente para probar el valor crítico del negocio (ej. escribir un comentario y verificar su publicación).
 * 4. Usamos 'test.step()' estratégicamente para que las trazas de fallos sean didácticas y legibles.
 */
test.describe('Hybrid E2E Flows - Seeding API + Validación UI', () => {
  // Generamos un usuario aleatorio único para esta suite
  const testUser = generateRandomUser();
  let userToken: string;

  // Pre-condición rápida: Registrar al usuario por API antes de comenzar los tests de UI
  test.beforeAll(async ({ playwright }) => {
    const apiUrl = process.env.API_URL || 'https://conduit-api.bondaracademy.com/api';
    const apiHost = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    // Creamos un contexto de API aislado para beforeAll apuntando al host de API correcto
    const apiContext = await playwright.request.newContext({
      baseURL: apiHost,
    });

    const response = await apiContext.post('/api/users', {
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

    // Cerramos el contexto temporal de API
    await apiContext.dispose();
  });

  test('Debería publicar un comentario en un artículo de forma híbrida', async ({
    page,
    api,
    articlePage,
    homePage,
  }) => {
    const articleTitle = `Artículo Híbrido E2E - ${Date.now()}`;
    let articleSlug = '';

    await test.step('1. Pre-condición: Crear artículo de forma rápida vía API (Seeding)', async () => {
      const response = await api.articles.createArticle(
        userToken,
        articleTitle,
        'Resumen del artículo de prueba híbrido',
        'Contenido largo del cuerpo del artículo creado por API para optimizar el test.',
        ['seeding', 'hybrid', 'playwright'],
      );

      expect(response.status()).toBe(201);
      const body = await response.json();
      articleSlug = body.article.slug;
    });

    await test.step('2. Bypass Login UI: Inyectar sesión directamente en el localStorage del navegador', async () => {
      // Navegamos al sitio para establecer el dominio de Conduit en el navegador
      await page.goto('/');

      // Inyectamos el JWT retornado por la API en el localStorage del navegador
      await page.evaluate((jwt) => {
        localStorage.setItem('jwtToken', jwt);
      }, userToken);

      // Recargamos para que el frontend lea la sesión activa
      await page.reload();

      // Aserción UI rápida: Comprobar que el header refleja la sesión del usuario (evitando flujos flaky)
      await expect(homePage.navProfile(testUser.username)).toBeVisible();
    });

    await test.step('3. Interacción UI: Navegar al artículo y agregar un comentario', async () => {
      // Navegamos directamente al artículo creado mediante su slug (sin clicks extras en la home)
      await page.goto(`/article/${articleSlug}`);

      const commentContent = 'Comentario de gran valor de negocio testeado por la UI!';

      // Publicamos el comentario usando el POM
      await articlePage.postComment(commentContent);

      // Verificamos en la interfaz que el comentario se haya añadido a la lista
      const comments = await articlePage.getComments();
      expect(comments).toContain(commentContent);
    });

    await test.step('4. Cleanup: Eliminar el artículo creado vía API para limpieza', async () => {
      const response = await api.articles.deleteArticle(userToken, articleSlug);
      expect([200, 204]).toContain(response.status());
    });
  });
});
