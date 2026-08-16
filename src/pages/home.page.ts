import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { APP_CONFIG } from '../config/env.config.js';

/**
 * Page Object Model para la Home y Feeds de artículos.
 *
 * Encapsula la interacción con la lista principal de artículos, cambios entre pestañas de feed
 * y obtención de etiquetas populares.
 */
export class HomePage extends BasePage {
  public readonly bannerHeading: Locator;
  public readonly globalFeedTab: Locator;
  public readonly yourFeedTab: Locator;
  public readonly articlePreviews: Locator;
  public readonly articleTitles: Locator;
  public readonly tagList: Locator;
  public readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    this.bannerHeading = this.page.locator('.banner h1');
    this.globalFeedTab = this.page
      .getByRole('button', { name: 'Global Feed' })
      .or(this.page.locator('.feed-toggle a.nav-link:has-text("Global Feed")'));
    this.yourFeedTab = this.page
      .getByRole('button', { name: 'Your Feed' })
      .or(this.page.locator('.feed-toggle a.nav-link:has-text("Your Feed")'));
    this.articlePreviews = this.page.locator('.article-preview');
    this.articleTitles = this.page.locator('.article-preview h1');
    this.tagList = this.page.locator('.sidebar .tag-list a');
    this.loadingIndicator = this.page.locator('.article-preview:has-text("Loading")');
  }

  /**
   * Navega explícitamente a la Home.
   */
  async navigate(): Promise<void> {
    await this.navigateTo(APP_CONFIG.routes.home);
  }

  /**
   * Cambia a la pestaña de "Global Feed" y espera a que los artículos carguen en la UI.
   */
  async selectGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
    await this.loadingIndicator
      .waitFor({ state: 'detached', timeout: APP_CONFIG.timeouts.short })
      .catch(() => {});
  }

  /**
   * Obtiene la lista de títulos de todos los artículos visibles en la página actual.
   */
  async getArticleTitles(): Promise<string[]> {
    await this.articleTitles
      .first()
      .waitFor({ state: 'visible', timeout: APP_CONFIG.timeouts.short })
      .catch(() => {});
    return this.articleTitles.allInnerTexts();
  }

  /**
   * Obtiene la lista de etiquetas populares visibles en la barra lateral.
   */
  async getTags(): Promise<string[]> {
    return this.tagList.allInnerTexts();
  }
}
