import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ayudantias/',
  build: {
    outDir: 'dist', // Directorio de salida local
    assetsDir: 'assets' // Carpeta para recursos estáticos
  }
})
