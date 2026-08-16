import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { APP_CONFIG } from '../config/env.config.js';
import { ArticlePayload } from '../models/article.model.js';

/**
 * Page Object Model para la creación y edición de Artículos.
 *
 * Encapsula la interacción con los campos del formulario para publicar artículos.
 */
export class EditorPage extends BasePage {
  public readonly titleInput: Locator;
  public readonly descriptionInput: Locator;
  public readonly bodyInput: Locator;
  public readonly tagsInput: Locator;
  public readonly publishButton: Locator;

  constructor(page: Page) {
    super(page);

    this.titleInput = this.page
      .getByPlaceholder('Article Title')
      .or(this.page.locator('input[name="title"]'));
    this.descriptionInput = this.page.getByPlaceholder("What's this article about?");
    this.bodyInput = this.page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = this.page.getByPlaceholder('Enter tags');
    this.publishButton = this.page
      .getByRole('button', { name: 'Publish Article' })
      .or(this.page.locator('button[type="button"]'));
  }

  /**
   * Navega explícitamente al editor de artículos.
   */
  async navigate(): Promise<void> {
    await this.navigateTo(APP_CONFIG.routes.editor);
  }

  /**
   * Completa y envía el formulario para crear un artículo.
   */
  async createArticle(payload: ArticlePayload): Promise<void>;
  async createArticle(
    title: string,
    description: string,
    body: string,
    tags?: string[],
  ): Promise<void>;
  async createArticle(
    titleOrPayload: string | ArticlePayload,
    description?: string,
    body?: string,
    tags?: string[],
  ): Promise<void> {
    const payload: ArticlePayload =
      typeof titleOrPayload === 'string'
        ? { title: titleOrPayload, description: description || '', body: body || '', tagList: tags }
        : titleOrPayload;

    await this.titleInput.fill(payload.title);
    await this.descriptionInput.fill(payload.description);
    await this.bodyInput.fill(payload.body);

    if (payload.tagList && payload.tagList.length > 0) {
      for (const tag of payload.tagList) {
        await this.tagsInput.fill(tag);
        await this.tagsInput.press('Enter');
      }
    }

    await this.publishButton.click();
  }
}
