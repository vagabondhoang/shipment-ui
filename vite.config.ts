import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["html"],
      include: ["src/**/*.{ts,tsx}"],
      reportsDirectory: "./coverage",
      exclude: [
        "src/main.tsx",
        "src/vite-env.d.ts",
        "**/*.d.ts",
      ],
    },
  },
})
