import { defineConfig } from 'cypress'
import { loadEnv } from 'vite'
import vitePreprocessor from 'cypress-vite'

const env = loadEnv('', process.cwd(), '')

const appHost = env.VITE_APP_HOST ?? 'http://localhost'
const appPort = env.VITE_APP_PORT ?? '5173'

export default defineConfig({
  e2e: {
    baseUrl: `${appHost}:${appPort}`,
    setupNodeEvents (on) {
      on('file:preprocessor', vitePreprocessor())
    },
    fixturesFolder: 'tests/e2e/fixtures',
    specPattern: 'tests/e2e/specs/**',
    supportFile: 'tests/e2e/support/e2e.js',
  },
})
