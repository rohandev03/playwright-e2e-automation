# Ecosistema de Automatización: Playwright, TypeScript y K6 (RealWorld Conduit)

Este es un repositorio de automatización de pruebas multi-nivel y altamente escalable diseñado para la aplicación **RealWorld Conduit** (disponible en https://conduit.bondaracademy.com/). El proyecto implementa una estrategia de aseguramiento de calidad moderna que cubre desde pruebas unitarias rápidas hasta pruebas híbridas extremo a extremo (E2E) y pruebas de rendimiento de backend y frontend.

---

## 1. Arquitectura y Estándares del Repositorio

El repositorio sigue un conjunto riguroso de principios de diseño y calidad de código:

*   **Page Object Model (POM):** Todas las interacciones de interfaz de usuario se encuentran encapsuladas en clases dentro de `src/pages/`. Los scripts de prueba no interactúan directamente con la estructura HTML de la página.
*   **Cero "Locators Inline" (Sin selectores embebidos):** Para facilitar la mantenibilidad, los archivos de prueba (`*.spec.ts`) no contienen selectores como `page.locator(...)`. Todos los localizadores se definen y documentan en sus correspondientes clases POM.
*   **DRY (Don't Repeat Yourself):** Reutilización máxima de funciones utilitarias y flujos de red.
*   **Bypass de Autenticación en UI:** En los flujos E2E complejos, la autenticación se realiza de manera instantánea mediante peticiones API tras bastidores, inyectando el token JWT resultante en el `localStorage` del navegador. Esto evita la lentitud e inconsistencia (*flakiness*) de rellenar el formulario de login UI repetidamente.
*   **Preparación Acelerada de Datos (API Seeding):** La creación de la data requerida para pruebas se realiza por llamadas API rápidas antes del inicio del test. La UI se reserva exclusivamente para validar el comportamiento específico de valor para el negocio.
*   **Quality Gates en Pull Requests:** Validación estática (Linter y Typecheck) y escaneo de vulnerabilidades automáticos bloquean la integración de código defectuoso a la rama principal.

---

## 2. Explicación de la Estructura de Directorios

A continuación se detalla el rol de cada una de las carpetas y archivos clave del proyecto:

```text
playwright-e2e-automation/
├── .github/workflows/             # Flujos de trabajo de CI/CD para GitHub Actions
│   ├── pr-validation.yml          # Validación de PRs (Quality Gates + Smoke Tests)
│   ├── weekly-regression.yml      # Regresión semanal programada (Suite completa)
│   └── weekly-performance.yml     # Rendimiento semanal backend con K6
├── k6/                            # Directorio de pruebas de rendimiento del backend
│   ├── config.js                  # Umbrales (thresholds) y variables de K6
│   ├── load-test.js               # Prueba de Carga (Load Test)
│   ├── stress-test.js             # Prueba de Estrés (Stress Test)
│   └── spike-test.js              # Prueba de Picos (Spike Test)
├── src/                           # Código fuente del framework
│   ├── api/                       # Clientes HTTP rápidos para interacción de API
│   │   ├── clients/               # Sub-clientes agrupados por endpoints (auth, articles)
│   │   └── api-manager.ts         # Orquestador central de clientes de API
│   ├── fixtures/                  # Extensiones y fixtures de Playwright
│   │   └── test-base.ts           # Inyección automática de POMs y API Clients en tests
│   ├── pages/                     # Clases POM (Page Object Model)
│   │   ├── base.page.ts           # Superclase con barra de navegación y navegación general
│   │   ├── login.page.ts          # Encapsula campos de login y errores
│   │   ├── home.page.ts           # Encapsula feeds globales/locales y listas de artículos
│   │   ├── editor.page.ts         # Encapsula formulario de creación/edición de artículos
│   │   └── article.page.ts        # Encapsula comentarios, lectura y borrado de artículos
│   └── utils/                     # Helpers y utilidades de soporte
│       ├── helpers.ts             # Generador de usuarios únicos y formateo de datos
│       └── performance-helper.ts  # Capturador de métricas web frontend (Core Web Vitals)
├── tests/                         # Suite de pruebas automatizadas
│   ├── unit/                      # Pruebas unitarias sobre helpers aislados
│   ├── api/                       # Pruebas de integración sobre la API REST
│   ├── ui/                        # Pruebas de Interfaz de Usuario
│   │   ├── functional.spec.ts     # UI Funcional (Casos límite: campos vacíos, credenciales incorrectas)
│   │   ├── integration.spec.ts    # UI Integración (Mockeo de red usando page.route)
│   │   ├── accessibility.spec.ts  # Accesibilidad (Axe Core WCAG 2.1 A/AA)
│   │   └── performance.spec.ts    # Rendimiento de carga frontend (FCP, TTFB)
│   └── hybrid/                    # Pruebas E2E híbridas (API Seeding + validación UI con test.step)
├── playwright.config.ts           # Configuración paralela, multi-browser (Chromium/Firefox/WebKit) y reintentos
├── package.json                   # Dependencias, metadatos y scripts del repositorio
└── tsconfig.json                  # Configuración de compilación de TypeScript
```

---

## 3. Guía de Instalación y Configuración

### Prerrequisitos
*   **Node.js** (versión 18 o superior recomendada).
*   **K6** instalado en tu sistema (opcional, necesario únicamente para correr rendimiento backend localmente). Puedes descargarlo desde [la web oficial de Grafana K6](https://k6.io/docs/get-started/installation/).

### Instalación
1.  Clona el repositorio.
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  Instala los navegadores que Playwright requiere para su ejecución:
    ```bash
    npx playwright install --with-deps
    ```
4.  Crea un archivo `.env` en la raíz del proyecto (puedes tomar como base `.env.example`):
    ```bash
    cp .env.example .env
    ```

---

## 4. Ejecución de Pruebas en Entorno Local

Puedes correr de forma selectiva cada uno de los tipos de prueba mediante los siguientes scripts configurados en el `package.json`:

### Pruebas Unitarias
Ejecuta las pruebas en aislamiento sobre las funciones auxiliares de utilidad:
```bash
npm run test:unit
```

### Pruebas de Integración de API
Ejecuta llamadas HTTP directas a los endpoints del servidor para validar la API REST:
```bash
npm run test:api
```

### Pruebas UI Funcionales
Valida los flujos de la interfaz frente a datos incorrectos y casos límites (Edge & Boundary Cases):
```bash
npm run test:functional
```

### Pruebas de Integración UI (Mocking de API)
Valida el comportamiento del frontend aislando la red (simulando errores 500 del servidor o cargando datos mockeados):
```bash
npm run test:integration
```

### Pruebas Híbridas E2E
Ejecuta las pruebas de extremo a extremo que preparan datos rápidos por API, inyectan la sesión en el localStorage del navegador y validan el flujo crítico en la UI:
```bash
npm run test:hybrid
```

### Pruebas de Accesibilidad (Axe Core)
Corre las auditorías automatizadas de accesibilidad bajo estándares WCAG 2.1 A y AA en las páginas principales:
```bash
npm run test:accessibility
```

### Ejecución de Suite Completa local
Corre de forma consecutiva e integrada toda la suite sobre múltiples navegadores:
```bash
npm test
```

---

## 5. Pruebas de Rendimiento de Backend con K6

Para verificar la resiliencia y el comportamiento del backend bajo estrés, ejecuta los scripts de K6 desde la raíz. Asegúrate de pasar las variables de entorno si lo necesitas:

### 1. Prueba de Carga (Load Test)
Simula tráfico normal concurrente (hasta 10 usuarios concurrentes).
```bash
k6 run k6/load-test.js
```

### 2. Prueba de Estrés (Stress Test)
Aumenta la carga progresivamente hasta 50 usuarios para identificar el límite de quiebre.
```bash
k6 run k6/stress-test.js
```

### 3. Pruebas de Picos (Spike Test)
Provoca un pico repentino y masivo de 80 usuarios concurrentes en segundos para validar la autorrecuperación.
```bash
k6 run k6/spike-test.js
```

> [!NOTE]
> Las pruebas de K6 validan de forma estricta los siguientes umbrales: el 95% de las llamadas HTTP debe responder en menos de **200ms** (`p(95)<200`) y la tasa general de errores de red debe ser menor al **1%** (`rate<0.01`).

---

## 6. Integración Continua (GitHub Actions Workflows)

El repositorio incluye tres flujos de trabajo declarativos en la carpeta `.github/workflows/`:

1.  **`pr-validation.yml` (Validación de Pull Requests):**
    *   **Disparador:** Cada `pull_request` dirigido a la rama `main` y `push` directos sobre `main`.
    *   **Quality Gates:** Ejecuta automáticamente `npm run lint` (estilo de código), `npm run typecheck` (compilación estricta de TypeScript) y `npm run security:scan` (auditoría de vulnerabilidades). Posteriormente instala los navegadores de Playwright y ejecuta las pruebas de PR (`npm run test:pr`).
    *   **Bloqueo:** Si algún paso de estas Quality Gates falla, se bloquea la fusión del PR en la interfaz de GitHub.
2.  **`weekly-regression.yml` (Regresión Semanal):**
    *   **Disparador:** Programado por Cron (`0 0 * * 0` - domingos a medianoche UTC) y ejecución manual (`workflow_dispatch`).
    *   **Ejecución:** Corre la regresión completa (`npm test`) en paralelo en Chromium, Firefox y WebKit.
    *   **Reportes:** Guarda el directorio `playwright-report` completo como un artefacto descargable (`zip`) en GitHub Actions para su visualización e inspección directa.
3.  **`weekly-performance.yml` (Rendimiento Semanal):**
    *   **Disparador:** Programado por Cron (`0 2 * * 6` - sábados a las 2:00 AM UTC) y ejecución manual (`workflow_dispatch`).
    *   **Ejecución:** Descarga la herramienta K6 e inicia consecutivamente las pruebas de Carga, Estrés y Picos, validando los umbrales establecidos.
    *   **Reportes:** Guarda las bitácoras y reportes generados por K6 como un artefacto descargable (`zip`) de la ejecución.
