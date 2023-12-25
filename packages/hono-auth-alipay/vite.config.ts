import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es'],
      fileName: 'index'
    }
  },
  plugins: [dts()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}', 'test/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts}'],
      exclude: ['**/types/**', '**/*.d.ts', '**/*.spec.{js,ts}'],
      reportsDirectory: './.coverage'
    }
  }
});
