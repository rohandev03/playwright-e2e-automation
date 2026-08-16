import { Page, Locator } from '@playwright/test';

/**
 * Component Object Model (COM) para la Barra de Navegación (Navbar).
 *
 * Desacopla los elementos y acciones de la barra de navegación de la clase BasePage,
 * aplicando el principio de Responsabilidad Única (SRP) y utilizando selectores semánticos de Playwright.
 */
export class NavbarComponent {
  private readonly page: Page;

  public readonly homeLink: Locator;
  public readonly signInLink: Locator;
  public readonly signUpLink: Locator;
  public readonly newArticleLink: Locator;
  public readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Uso de localizadores semánticos y basados en roles recomendados por Playwright
    this.homeLink = this.page.locator('.navbar-brand, a.nav-link:has-text("Home")').first();
    this.signInLink = this.page.getByRole('link', { name: 'Sign in' });
    this.signUpLink = this.page.getByRole('link', { name: 'Sign up' });
    this.newArticleLink = this.page.getByRole('link', { name: 'New Article' });
    this.settingsLink = this.page.getByRole('link', { name: 'Settings' });
  }

  /**
   * Obtiene el localizador del enlace de perfil para un usuario determinado.
   * @param username Nombre del usuario autenticado
   */
  getUserProfile(username: string): Locator {
    return this.page.getByRole('link', { name: username });
  }
}
