import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * NOTA EXPLICATIVA:
 * src/pages/article.page.ts - Page Object Model para la visualización detallada de un Artículo.
 *
 * Encapsula la lectura del contenido del artículo (título y cuerpo), la interacción con la sección
 * de comentarios (publicar y leer comentarios), y las opciones de eliminación.
 */
export class ArticlePage extends BasePage {
  // Localizadores del artículo y sus comentarios
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
    this.commentTextArea = this.page.locator('.comment-form textarea');
    this.postCommentButton = this.page.locator('.comment-form button[type="submit"]');
    this.commentCards = this.page.locator('.card:has(.card-block)');
    this.commentTexts = this.page.locator('.card-block .card-text');
    // Selector para borrar artículo, disponible sólo para el creador
    this.deleteArticleButton = this.page
      .locator('button.btn-outline-danger:has-text("Delete Article")')
      .first();
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
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    return this.commentTexts.allInnerTexts();
  }

  /**
   * Borra el artículo actual (haciendo click en el botón correspondiente).
   */
  async deleteArticle(): Promise<void> {
    await this.deleteArticleButton.click();
  }
}
