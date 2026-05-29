import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * NOTA EXPLICATIVA:
 * src/pages/editor.page.ts - Page Object Model para la creación de Artículos.
 *
 * Encapsula la interacción con los campos del formulario para publicar o editar artículos.
 * Cumple con el estándar DRY y encapsulamiento estricto de selectores.
 */
export class EditorPage extends BasePage {
  // Localizadores específicos del formulario
  public readonly titleInput: Locator;
  public readonly descriptionInput: Locator;
  public readonly bodyInput: Locator;
  public readonly tagsInput: Locator;
  public readonly publishButton: Locator;

  constructor(page: Page) {
    super(page);

    this.titleInput = this.page.locator('input[placeholder="Article Title"], input[name="title"]');
    this.descriptionInput = this.page.locator('input[placeholder="What\'s this article about?"]');
    this.bodyInput = this.page.locator('textarea[placeholder="Write your article (in markdown)"]');
    this.tagsInput = this.page.locator('input[placeholder="Enter tags"]');
    this.publishButton = this.page.locator(
      'button:has-text("Publish Article"), button[type="button"]',
    );
  }

  /**
   * Navega explícitamente al editor de artículos.
   */
  async navigate(): Promise<void> {
    await this.navigateTo('/editor');
  }

  /**
   * Completa y envía el formulario para crear un artículo.
   * @param title Título del artículo
   * @param description Breve descripción de qué trata
   * @param body Contenido del artículo
   * @param tags Listado de etiquetas asociadas (opcional)
   */
  async createArticle(
    title: string,
    description: string,
    body: string,
    tags?: string[],
  ): Promise<void> {
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);

    // Playwright permite presionar Enter para agregar etiquetas una a una
    if (tags) {
      for (const tag of tags) {
        await this.tagsInput.fill(tag);
        await this.tagsInput.press('Enter');
      }
    }

    await this.publishButton.click();
  }
}
