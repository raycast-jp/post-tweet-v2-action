import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['json-summary', 'text', 'lcov']
    }
  }
})
