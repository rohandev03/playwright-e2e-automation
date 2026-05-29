import { Page, Locator } from '@playwright/test';

/**
 * NOTA EXPLICATIVA:
 * src/pages/base.page.ts - Clase Base para Page Object Model (POM).
 *
 * De acuerdo a los estándares del repositorio (POM, DRY, sin locators inline):
 * 1. Esta clase encapsula la instancia de Playwright 'Page'.
 * 2. Define métodos y elementos comunes compartidos por todas las páginas (ej. la barra de navegación superior).
 * 3. Todas las páginas específicas extenderán de esta clase base.
 * 4. NUNCA se deben incluir selectores de texto directamente en las pruebas; siempre se definen como propiedades tipo Locator.
 */
export class BasePage {
  protected readonly page: Page;

  // Localizadores comunes de la barra de navegación superior (Navbar)
  public readonly navHome: Locator;
  public readonly navSignIn: Locator;
  public readonly navSignUp: Locator;
  public readonly navNewArticle: Locator;
  public readonly navSettings: Locator;
  public readonly navProfile: (username: string) => Locator;

  constructor(page: Page) {
    this.page = page;

    // Inicialización de localizadores comunes utilizando buenas prácticas (selectores robustos y semánticos)
    this.navHome = this.page.locator('.navbar-brand, a.nav-link:has-text("Home")').first();
    this.navSignIn = this.page.locator('a.nav-link:has-text("Sign in")');
    this.navSignUp = this.page.locator('a.nav-link:has-text("Sign up")');
    this.navNewArticle = this.page.locator('a.nav-link:has-text("New Article")');
    this.navSettings = this.page.locator('a.nav-link:has-text("Settings")');

    // Localizador dinámico parametrizado por el nombre del usuario
    this.navProfile = (username: string) => this.page.locator(`a.nav-link:has-text("${username}")`);
  }

  /**
   * Navega a una ruta específica dentro del sitio web.
   * @param path Ruta relativa (ej. '/login')
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Espera a que la carga del navegador sea completada a nivel de red (ideal para transiciones lentas).
   */
  async waitForNetworkIdle(): Promise<void> {
    // Usamos un timeout de 15 segundos y capturamos el posible error para evitar fallos por conexiones de red pendientes.
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  /**
   * Obtiene la URL actual visible en el navegador.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
