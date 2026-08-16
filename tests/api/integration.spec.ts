import { test, expect } from '../../src/fixtures/test-base.js';
import { generateRandomUser, TestUser } from '../../src/utils/helpers.js';
import { UserResponse } from '../../src/models/user.model.js';
import { ArticleResponse } from '../../src/models/article.model.js';

/**
 * tests/api/integration.spec.ts - Pruebas Funcionales de API.
 *
 * Valida flujos CRUD en backend usando modelos fuertemente tipados (POO + DRY).
 */
test.describe('API Integration Tests - Conduit Backend Services', () => {
  test.describe.configure({ mode: 'serial' });

  let testUser: TestUser;
  let userToken: string;
  let createdArticleSlug: string;

  test.beforeAll(() => {
    testUser = generateRandomUser();
  });

  test('1. Debería registrar un nuevo usuario con datos únicos', async ({ api }) => {
    const response = await api.auth.register(testUser);

    expect(response.status()).toBe(201);

    const body = (await response.json()) as UserResponse;
    expect(body.user.username).toBe(testUser.username);
    expect(body.user.email).toBe(testUser.email);
    expect(body.user.token).toBeDefined();

    userToken = body.user.token;
  });

  test('2. Debería iniciar sesión correctamente con las credenciales registradas', async ({
    api,
  }) => {
    const response = await api.auth.login({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as UserResponse;
    expect(body.user.token).toBeDefined();
    expect(body.user.email).toBe(testUser.email);
  });

  test('3. Debería crear un nuevo artículo exitosamente mediante API', async ({ api }) => {
    const articleTitle = `Automatización API - ${Date.now()}`;
    const response = await api.articles.createArticle(userToken, {
      title: articleTitle,
      description: 'Descripción rápida del artículo de prueba API',
      body: 'Contenido largo del cuerpo del artículo redactado por API.',
      tagList: ['qa', 'api', 'playwright'],
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as ArticleResponse;
    expect(body.article.title).toBe(articleTitle);
    expect(body.article.slug).toBeDefined();

    createdArticleSlug = body.article.slug;
  });

  test('4. Debería eliminar el artículo creado previamente por API', async ({ api }) => {
    test.skip(!createdArticleSlug, 'No se pudo crear el artículo previamente');

    const response = await api.articles.deleteArticle(userToken, createdArticleSlug);

    expect([200, 204]).toContain(response.status());
  });
});
