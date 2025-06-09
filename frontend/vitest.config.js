/*import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import tailwindcss from '@tailwindcss/vite'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      // Plugin Tailwind pour le run et les tests
      tailwindcss(),
    ],
    test: {
      environment: 'jsdom',                               // simulation DOM
      globals: true,                                      // expect(), vi.fn(), …
      setupFiles: './tests/setup.js',                     // mocks globaux (optionnel)
      exclude: [...configDefaults.exclude, 'e2e/**'],     // ignore dossier e2e
      root: fileURLToPath(new URL('./', import.meta.url)) // racine tests
    },
  })
)
*/
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import tailwindcss from '@tailwindcss/vite'

// Merge the base viteConfig with additional configurations for plugins and testing
export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      // Adding Tailwind CSS as a plugin:
      tailwindcss(),
    ],
    test: {
      environment: 'jsdom',
      // Extend default excludes by also leaving out the 'e2e' folder:
      exclude: [...configDefaults.exclude, 'e2e/**'],
      // Define root relative to the current directory:
      root: fileURLToPath(new URL('./', import.meta.url)),

      // Enable code coverage
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'], // Use 'text' for terminal output and 'html' for detailed report
        all: true, // Include all files in coverage
        enabled: true, // Forcer l'activation
        reportsDirectory: './coverage',
        include: ['src/**/*.{js,ts,vue}'], // Specify files to be included for coverage
        exclude: [
    'node_modules/**',
    'tests/**',
    '**/*.config.js',
    '**/main.js' // généralement pas testé
  ],
      },
    },
  })
)