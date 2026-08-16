import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';
import { APP_CONFIG } from '../config/env.config.js';
import { UserRegisterPayload } from '../models/user.model.js';

/**
 * Page Object Model para la página de Registro de Usuario (Sign Up).
 * Encapsula localizadores semánticos y acciones del formulario de registro.
 */
export class RegisterPage extends BasePage {
  public readonly heading: Locator;
  public readonly usernameInput: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly signUpButton: Locator;
  public readonly errorMessageList: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = this.page.getByRole('heading', { name: 'Sign up' });
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.emailInput = this.page.getByPlaceholder('Email');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.signUpButton = this.page.getByRole('button', { name: 'Sign up' });
    this.errorMessageList = this.page.locator('.error-messages li');
  }

  /**
   * Navega a la ruta de registro.
   */
  async navigate(): Promise<void> {
    await this.navigateTo(APP_CONFIG.routes.register);
  }

  /**
   * Completa y envía el formulario de registro.
   */
  async register(username: string, email: string, password: string): Promise<void>;
  async register(payload: UserRegisterPayload): Promise<void>;
  async register(
    usernameOrPayload: string | UserRegisterPayload,
    email?: string,
    password?: string,
  ): Promise<void> {
    const payload =
      typeof usernameOrPayload === 'string'
        ? { username: usernameOrPayload, email: email || '', password: password || '' }
        : usernameOrPayload;

    await this.usernameInput.fill(payload.username);
    await this.emailInput.fill(payload.email);
    await this.passwordInput.fill(payload.password);
    await this.signUpButton.click();
  }

  /**
   * Obtiene los mensajes de error mostrados en la página.
   */
  async getErrorMessages(): Promise<string[]> {
    await this.errorMessageList
      .first()
      .waitFor({ state: 'visible', timeout: APP_CONFIG.timeouts.short })
      .catch(() => {});
    return this.errorMessageList.allInnerTexts();
  }
}
