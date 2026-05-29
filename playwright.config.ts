import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * NOTA EXPLICATIVA:
 * Cargar variables de entorno desde el archivo '.env' en la raíz.
 * Esto permite evitar código hardcodeado (credenciales, URL base, etc.) y separar la configuración del código fuente.
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * NOTA EXPLICATIVA:
 * Configuración centralizada de Playwright.
 * Aquí se definen los parámetros de ejecución en paralelo, multi-navegador, reintentos y reportería.
 */
export default defineConfig({
  // Directorio raíz donde Playwright buscará las pruebas (*.spec.ts)
  testDir: './tests',

  // Habilita la ejecución paralela para todas las pruebas dentro de los archivos.
  // Esto acelera drásticamente la ejecución aprovechando múltiples núcleos de CPU.
  fullyParallel: true,

  // Detiene inmediatamente la suite si por error se dejó un 'test.only' activo en CI.
  forbidOnly: !!process.env.CI,

  // Reintentos automáticos para mitigar "flaky tests" (pruebas inconsistentes).
  // En entornos locales se ejecuta 0 veces para depuración rápida; en CI se reintenta hasta 2 veces.
  retries: process.env.CI ? 2 : 0,

  // Número de hilos (workers) ejecutándose de manera simultánea.
  // En CI fijamos un límite controlado de 4 workers para no saturar el servidor Jenkins.
  workers: process.env.CI ? 4 : undefined,

  // Configuración de reportes generados tras la ejecución.
  // Generamos un reporte HTML completo para visualización interactiva y un archivo JUnit XML para Jenkins.
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],

  // Configuración compartida para todos los proyectos (navegadores).
  use: {
    // URL base de la aplicación bajo prueba. Se lee desde el archivo '.env' o usa Conduit por defecto.
    baseURL: process.env.BASE_URL || 'https://conduit.bondaracademy.com',

    // Captura capturas de pantalla únicamente cuando una prueba falla, optimizando el rendimiento.
    screenshot: 'only-on-failure',

    // Graba video y lo conserva únicamente en caso de fallo para análisis posterior.
    video: 'retain-on-failure',

    // Registra una traza de ejecución detallada en el primer reintento del test.
    // Esto permite inspeccionar la consola de red, DOM y tiempos en la UI de Playwright.
    trace: 'on-first-retry',
  },

  // Configuración de proyectos para probar en múltiples motores de navegación en paralelo.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
