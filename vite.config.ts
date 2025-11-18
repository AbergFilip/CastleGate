import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Tillåt åtkomst från nätverket (för Android emulator)
    port: 5173,
    // Valfritt: öppna automatiskt i webbläsare
    open: false
  }
})

