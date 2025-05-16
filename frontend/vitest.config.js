import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';
import tailwindcss from '@tailwindcss/vite';

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
  }),
);
