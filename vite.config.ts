import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tsconfigPaths from 'vite-tsconfig-paths'

import sassOptions from './src/vite/sassOptions'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ]
    },
    preprocessorOptions: {
      scss: sassOptions
    }
  }
})
