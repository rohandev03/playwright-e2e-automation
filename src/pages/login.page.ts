import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { APP_CONFIG } from '../config/env.config.js';
import { UserCredentials } from '../models/user.model.js';

/**
 * Page Object Model para la página de Inicio de Sesión (Login).
 *
 * Hereda de BasePage y utiliza localizadores semánticos y métodos de intención de negocio.
 */
export class LoginPage extends BasePage {
  public readonly heading: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signInButton: Locator;
  public readonly errorMessageList: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = this.page.getByRole('heading', { name: 'Sign in' });
    this.emailInput = this.page.getByPlaceholder('Email');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
    this.errorMessageList = this.page.locator('.error-messages li');
  }

  /**
   * Navega explícitamente a la URL de inicio de sesión.
   */
  async navigate(): Promise<void> {
    await this.navigateTo(APP_CONFIG.routes.login);
  }

  /**
   * Limpia los campos del formulario de inicio de sesión.
   */
  async clearForm(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
  }

  /**
   * Rellena el formulario de login y lo envía.
   */
  async login(email: string, password: string): Promise<void>;
  async login(credentials: UserCredentials): Promise<void>;
  async login(emailOrCredentials: string | UserCredentials, password?: string): Promise<void> {
    const email =
      typeof emailOrCredentials === 'string' ? emailOrCredentials : emailOrCredentials.email;
    const pwd =
      typeof emailOrCredentials === 'string' ? password || '' : emailOrCredentials.password;

    await this.emailInput.fill(email);
    await this.passwordInput.fill(pwd);
    await this.signInButton.click();
  }

  /**
   * Obtiene la lista de textos de mensajes de error de autenticación visibles en la página.
   */
  async getErrorMessages(): Promise<string[]> {
    await this.errorMessageList
      .first()
      .waitFor({ state: 'visible', timeout: APP_CONFIG.timeouts.short })
      .catch(() => {});
    return this.errorMessageList.allInnerTexts();
  }
}
