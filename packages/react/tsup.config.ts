import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable type declarations for now
  external: ['react', 'react-dom'],
  sourcemap: true,
  clean: true,
});