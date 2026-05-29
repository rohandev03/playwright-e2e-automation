import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * NOTA EXPLICATIVA:
 * src/pages/home.page.ts - Page Object Model para la Home y Feeds de artículos.
 *
 * Encapsula la interacción con la lista principal de artículos, cambios entre pestañas de feed
 * (Global y Personalizado), y filtrado por etiquetas populares de la barra lateral.
 */
export class HomePage extends BasePage {
  // Localizadores específicos de la Home
  public readonly globalFeedTab: Locator;
  public readonly yourFeedTab: Locator;
  public readonly articlePreviews: Locator;
  public readonly articleTitles: Locator;
  public readonly tagList: Locator;
  public readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Mapeo de elementos dinámicos en la UI de Conduit
    this.globalFeedTab = this.page.locator('.feed-toggle a.nav-link:has-text("Global Feed")');
    this.yourFeedTab = this.page.locator('.feed-toggle a.nav-link:has-text("Your Feed")');
    this.articlePreviews = this.page.locator('.article-preview');
    this.articleTitles = this.page.locator('.article-preview h1');
    this.tagList = this.page.locator('.sidebar .tag-list a');
    this.loadingIndicator = this.page.locator('.article-preview:has-text("Loading")');
  }

  /**
   * Navega explícitamente a la Home.
   */
  async navigate(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Cambia a la pestaña de "Global Feed" y espera a que los artículos carguen en la UI.
   */
  async selectGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
    // Esperamos a que el texto "Loading..." desaparezca para asegurar consistencia
    await this.loadingIndicator.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  /**
   * Obtiene la lista de títulos de todos los artículos visibles en la página actual.
   */
  async getArticleTitles(): Promise<string[]> {
    await this.articleTitles
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    return this.articleTitles.allInnerTexts();
  }
}
