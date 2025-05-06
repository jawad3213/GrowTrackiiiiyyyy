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
    },
  })
)
