import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { HomePage } from '../pages/home.page.js';
import { EditorPage } from '../pages/editor.page.js';
import { ArticlePage } from '../pages/article.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { BasePage } from '../pages/base.page.js';
import { ApiManager } from '../api/api-manager.js';
import { APP_CONFIG } from '../config/env.config.js';

/**
 * Fixtures personalizadas con Inyección de Dependencias (Playwright test extension).
 *
 * Ventajas:
 * 1. Lazily-loaded: Sólo se instancia el objeto si el test lo declara en sus argumentos.
 * 2. Mantiene los tests limpios y adheridos a POM y DRY.
 * 3. Ciclo de vida automatizado y aislado por test.
 */

// Definición de tipos para nuestras fixtures personalizadas
type CustomFixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  homePage: HomePage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
  registerPage: RegisterPage;
  api: ApiManager;
};

// Extendemos el test base de Playwright con nuestras fixtures
export const test = baseTest.extend<CustomFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  editorPage: async ({ page }, use) => {
    const editorPage = new EditorPage(page);
    await use(editorPage);
  },

  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page);
    await use(articlePage);
  },

  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  api: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: APP_CONFIG.apiHost,
    });
    const apiManager = new ApiManager(apiContext);
    await use(apiManager);
    await apiContext.dispose();
  },
});

// Exportamos 'expect' de forma nativa desde aquí para unificar imports en los archivos de pruebas
export { expect } from '@playwright/test';
