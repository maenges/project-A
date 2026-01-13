import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const apiBaseUrl = process.env.VITE_API_BASE_URL;
const apiOrigin = process.env.VITE_API_ORIGIN;

// https://vitejs.dev/config/
export default defineConfig({
  // Windows에서 백신/인덱서/에디터가 node_modules\.vite 를 잠그면
  // deps_temp -> deps rename 시 EPERM이 발생할 수 있어 캐시 위치를 분리합니다.
  cacheDir: resolve(__dirname, './.vite'),
  plugins: [
    react({
      babel: {
        compact: false,  // 큰 파일에 대한 경고 메시지 비활성화
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
