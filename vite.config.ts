/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return defineConfig({
    plugins: [react()],
    define: {
      'import.meta.vitest': process.env.mode === 'test',
    },
    server: {
      strictPort: true,
      port: Number(process.env.PORT) || 3300,
    },
    resolve: {
      alias: [
        {
          find: /^~\/(.*)/,
          replacement: "/src/$1",
        },
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          // for easy components access
          find: /^@components\/(.*)/,
          replacement: '/src/components/$1',
        },
        {
          // for easy components access
          find: /^@pages\/(.*)/,
          replacement: '/src/pages/$1',
        },
        {
          find: "test-util",
          replacement: "/src/utils/test-util",
        }
      ],
    },
    test: {
      globals: true,
      exclude: [...configDefaults.exclude],
      includeSource: [...configDefaults.include, 'src/**/*.{js,ts}'],
      environment: 'jsdom',
      setupFiles: ['./src/setup.ts'],
    },
  });
}
