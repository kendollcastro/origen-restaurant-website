import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Las animaciones de entrada (reveal/hero) son mejora progresiva. Los E2E
    // evalúan el estado final y estable: sin esto, axe mide colores a mitad de
    // transición (opacidad < 1) y reporta falsos positivos de contraste.
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Pixel 5', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    // `--ignore-lock` fuerza primer plano: en astro ≥7 `astro preview` daemoniza
    // cuando detecta un agente en el shell y el proceso del webServer sale al punto.
    command: 'npm run build && npm run preview -- --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
