import { test, expect } from '../../src/fixtures/test-base.js';
import { generateRandomUser } from '../../src/utils/helpers.js';

/**
 * NOTA EXPLICATIVA:
 * tests/api/integration.spec.ts - Pruebas Funcionales de API.
 *
 * Estas pruebas interactúan de forma directa con los servicios web utilizando
 * peticiones HTTP rápidas e independientes de la UI. Se evalúan códigos de estado
 * HTTP, esquemas de datos de respuesta y consistencia del backend.
 */
test.describe('API Integration Tests - Conduit Backend Services', () => {
  // Ejecutamos en serie ya que las pruebas tienen dependencia de estado (registro -> login -> creación -> borrado)
  test.describe.configure({ mode: 'serial' });

  // Datos únicos del usuario para evitar colisiones
  const testUser = generateRandomUser();
  let userToken: string;
  let createdArticleSlug: string;

  test('1. Debería registrar un nuevo usuario con datos únicos', async ({ api }) => {
    const response = await api.auth.register(testUser.username, testUser.email, testUser.password);

    // Validar código de respuesta (201 Created)
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.user.username).toBe(testUser.username);
    expect(body.user.email).toBe(testUser.email);
    expect(body.user.token).toBeDefined();

    // Guardamos el token de sesión para peticiones subsecuentes
    userToken = body.user.token;
  });

  test('2. Debería iniciar sesión correctamente con las credenciales registradas', async ({
    api,
  }) => {
    const response = await api.auth.login(testUser.email, testUser.password);

    // Validar código de respuesta (200 OK)
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.user.token).toBeDefined();
    expect(body.user.email).toBe(testUser.email);
  });

  test('3. Debería crear un nuevo artículo exitosamente mediante API', async ({ api }) => {
    const articleTitle = `Automatización API - ${Date.now()}`;
    const response = await api.articles.createArticle(
      userToken,
      articleTitle,
      'Descripción rápida del artículo de prueba API',
      'Contenido largo del cuerpo del artículo redactado por API.',
      ['qa', 'api', 'playwright'],
    );

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.article.title).toBe(articleTitle);
    expect(body.article.slug).toBeDefined();

    // Guardamos el slug del artículo para poder borrarlo en el cleanup
    createdArticleSlug = body.article.slug;
  });

  test('4. Debería eliminar el artículo creado previamente por API', async ({ api }) => {
    // Si no se creó el artículo, omitimos el test
    test.skip(!createdArticleSlug, 'No se pudo crear el artículo previamente');

    const response = await api.articles.deleteArticle(userToken, createdArticleSlug);

    // Validar código de respuesta de eliminación exitosa (200 OK o 204 No Content)
    expect([200, 204]).toContain(response.status());
  });
});
