import { Page, Locator } from '@playwright/test';
import { NavbarComponent } from './components/navbar.component.js';
import { APP_CONFIG } from '../config/env.config.js';

/**
 * Clase Base para Page Object Model (POM).
 *
 * Estándares implementados:
 * 1. Encapsula la instancia de Playwright 'Page'.
 * 2. Compone el componente común 'navbar' (Component Object Model).
 * 3. Centraliza utilidades transversales como inyección de sesión y navegación con rutas centralizadas.
 * 4. Mantiene compatibilidad retroactiva con accesos previos a la Navbar.
 */
export class BasePage {
  protected readonly page: Page;

  // Componente de barra de navegación superior
  public readonly navbar: NavbarComponent;

  // Aliases de compatibilidad retroactiva
  public get navHome(): Locator {
    return this.navbar.homeLink;
  }
  public get navSignIn(): Locator {
    return this.navbar.signInLink;
  }
  public get navSignUp(): Locator {
    return this.navbar.signUpLink;
  }
  public get navNewArticle(): Locator {
    return this.navbar.newArticleLink;
  }
  public get navSettings(): Locator {
    return this.navbar.settingsLink;
  }
  public navProfile(username: string): Locator {
    return this.navbar.getUserProfile(username);
  }

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page);
  }

  /**
   * Navega a una ruta específica dentro del sitio web.
   * @param path Ruta relativa (ej. '/login') o absoluta
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Inyecta el token JWT en el localStorage del navegador y recarga la página para simular sesión activa.
   * Evita flujos lentos o repetitivos de login en la UI (Bypass Auth).
   * @param token Token JWT obtenido por API
   */
  async setAuthSession(token: string): Promise<void> {
    await this.page.goto(APP_CONFIG.routes.home);
    await this.page.evaluate((jwt) => {
      localStorage.setItem('jwtToken', jwt);
    }, token);
    await this.page.reload();
  }

  /**
   * Espera a que la carga de la página esté estabilizada.
   */
  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Obtiene la URL actual visible en el navegador.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}
