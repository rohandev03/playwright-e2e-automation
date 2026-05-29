import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * NOTA EXPLICATIVA:
 * src/pages/login.page.ts - Page Object Model para la página de Inicio de Sesión (Login).
 *
 * Esta clase hereda de BasePage. Encapsula todos los localizadores (sin inline locators en tests)
 * y la lógica para iniciar sesión o verificar errores del formulario.
 */
export class LoginPage extends BasePage {
  // Declaración de localizadores específicos
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signInButton: Locator;
  public readonly errorMessageList: Locator;

  constructor(page: Page) {
    super(page);

    // Mapeo de elementos de la interfaz usando selectores robustos
    this.emailInput = this.page.locator('input[placeholder="Email"], input[type="email"]');
    this.passwordInput = this.page.locator('input[placeholder="Password"], input[type="password"]');
    this.signInButton = this.page.locator('button[type="submit"]');
    // Selector para capturar errores de validación de credenciales (generalmente mostrados en una lista roja)
    this.errorMessageList = this.page.locator('.error-messages li');
  }

  /**
   * Navega explícitamente a la URL de inicio de sesión.
   */
  async navigate(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Rellena el formulario de login y lo envía.
   * @param email Correo electrónico
   * @param password Contraseña
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Obtiene la lista de textos de mensajes de error de autenticación visibles en la página.
   */
  async getErrorMessages(): Promise<string[]> {
    // Espera breve por el elemento en caso de renderizado asíncrono lento
    await this.errorMessageList
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    return this.errorMessageList.allInnerTexts();
  }
}
