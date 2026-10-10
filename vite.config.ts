import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' 讓 build 結果可以直接部署到任何靜態網站子路徑（例如 GitHub Pages）
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
