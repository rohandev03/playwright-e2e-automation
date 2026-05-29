import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { HomePage } from '../pages/home.page.js';
import { EditorPage } from '../pages/editor.page.js';
import { ArticlePage } from '../pages/article.page.js';
import { ApiManager } from '../api/api-manager.js';

/**
 * NOTA EXPLICATIVA:
 * src/fixtures/test-base.ts - Inyección de Dependencias a través de Fixtures.
 *
 * En lugar de inicializar manualmente los Page Objects o Clientes de API en cada test
 * mediante 'new LoginPage(page)', Playwright permite extender su objeto de pruebas ('test')
 * para declarar "Fixtures" personalizadas.
 *
 * Ventajas:
 * 1. Mantiene las firmas de los tests limpias.
 * 2. Lazily-loaded: Sólo se instancia el objeto si el test lo declara en sus argumentos.
 * 3. Ciclo de vida automatizado y aislado por test.
 */

// Definición de tipos para nuestras fixtures personalizadas
type CustomFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
  api: ApiManager;
};

// Extendemos el test base de Playwright con nuestras fixtures
export const test = baseTest.extend<CustomFixtures>({
  // Fixture para interactuar con la página de Login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture para interactuar con la página de Home
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Fixture para interactuar con la página de Creación de Artículos
  editorPage: async ({ page }, use) => {
    const editorPage = new EditorPage(page);
    await use(editorPage);
  },

  // Fixture para interactuar con la página de Detalle de Artículos
  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page);
    await use(articlePage);
  },

  // Fixture para interactuar con el orquestador de API REST
  api: async ({ playwright }, use) => {
    const apiUrl = process.env.API_URL || 'https://conduit-api.bondaracademy.com/api';
    // Extraer el host para que llamadas relativas como '/api/users' resuelvan sobre el dominio de API
    const apiHost = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    const apiContext = await playwright.request.newContext({
      baseURL: apiHost,
    });
    const apiManager = new ApiManager(apiContext);
    await use(apiManager);
    await apiContext.dispose();
  },
});

// Exportamos 'expect' de forma nativa desde aquí para unificar imports en los archivos de pruebas
export { expect } from '@playwright/test';
