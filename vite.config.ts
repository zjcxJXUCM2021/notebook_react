import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  envDir: './src/env',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': { // 匹配所有以 /api 开头的请求
        target: 'http://124.221.73.180:3002', // 后端地址
        changeOrigin: true,
        // 如果后端接口没有 /api 前缀，可以用 rewrite 去掉
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }

})
