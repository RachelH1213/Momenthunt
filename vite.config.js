
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Momenthunt/',  // 注意大小写必须与仓库名一致
  plugins: [react()],
});
