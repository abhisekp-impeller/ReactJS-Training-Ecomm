import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default ({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};
  return defineConfig({
    plugins: [react()],
    server: {
      strictPort: true,
      port: Number(process.env.PORT) || 3300,
    },
    resolve: {
      alias: [
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1',
        },
      ],
    },
  });
}
