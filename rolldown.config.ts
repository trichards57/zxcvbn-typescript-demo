import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    format: 'esm',
    sourcemap: true,
  },
});
