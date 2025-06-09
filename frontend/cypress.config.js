import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173',
    experimentalStudio: true,
    chromeWebSecurity: false, // Disable web security for CORS
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // Setup node events
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })
    },
    env: {
      // Environment variables for your tests
      BACKEND_URL: 'http://localhost:3000',
      FRONTEND_URL: 'http://localhost:5173'
    },
    // Support for test isolation
    testIsolation: true,
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0
    }
  },
  // Component testing configuration (if needed later)
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})