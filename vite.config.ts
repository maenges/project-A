import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const apiBaseUrl = process.env.VITE_API_BASE_URL;
const apiOrigin = process.env.VITE_API_ORIGIN;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@services': resolve(__dirname, './src/services'),
      '@components': resolve(__dirname, './src/components'),
      '@types': resolve(__dirname, './src/types'),
      '@features': resolve(__dirname, './src/features'),
      '@libs': resolve(__dirname, './src/libs'),
      '@stores': resolve(__dirname, './src/stores'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@layout': resolve(__dirname, './src/layout'),
      '@app': resolve(__dirname, './src/app'),
      '@api': resolve(__dirname, './src/services/api'),
      '@models': resolve(__dirname, './src/models'),
      '@utils': resolve(__dirname, './src/utils'),
      '@style': resolve(__dirname, './src/assets/style'),
      '@images': resolve(__dirname, './src/assets/images'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: apiOrigin || '',
        },
      },
    },
    port: 3000,
    host: true,
    open: true,
  },
});
