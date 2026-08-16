import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { APP_CONFIG } from '../config/env.config.js';

/**
 * Page Object Model para la visualización detallada de un Artículo.
 *
 * Encapsula la lectura del contenido del artículo, comentarios y eliminación.
 */
export class ArticlePage extends BasePage {
  public readonly articleTitle: Locator;
  public readonly articleBody: Locator;
  public readonly commentTextArea: Locator;
  public readonly postCommentButton: Locator;
  public readonly commentCards: Locator;
  public readonly commentTexts: Locator;
  public readonly deleteArticleButton: Locator;

  constructor(page: Page) {
    super(page);

    this.articleTitle = this.page.locator('.article-page h1');
    this.articleBody = this.page.locator('.article-content p');
    this.commentTextArea = this.page.getByPlaceholder('Write a comment...');
    this.postCommentButton = this.page.getByRole('button', { name: 'Post Comment' });
    this.commentCards = this.page.locator('.card:has(.card-block)');
    this.commentTexts = this.page.locator('.card-block .card-text');
    this.deleteArticleButton = this.page
      .getByRole('button', { name: 'Delete Article' })
      .or(this.page.locator('button.btn-outline-danger:has-text("Delete Article")'))
      .first();
  }

  /**
   * Navega a un artículo específico por su slug.
   */
  async navigateToArticle(slug: string): Promise<void> {
    await this.navigateTo(APP_CONFIG.routes.article(slug));
  }

  /**
   * Escribe y publica un comentario en el artículo.
   * @param commentText Contenido del comentario
   */
  async postComment(commentText: string): Promise<void> {
    await this.commentTextArea.fill(commentText);
    await this.postCommentButton.click();
  }

  /**
   * Obtiene la lista de textos de los comentarios agregados al artículo actual.
   */
  async getComments(): Promise<string[]> {
    await this.commentTexts
      .first()
      .waitFor({ state: 'visible', timeout: APP_CONFIG.timeouts.short })
      .catch(() => {});
    return this.commentTexts.allInnerTexts();
  }

  /**
   * Borra el artículo actual haciendo click en el botón correspondiente.
   */
  async deleteArticle(): Promise<void> {
    await this.deleteArticleButton.click();
  }
}
