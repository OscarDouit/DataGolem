import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT || 4000,  // Utilise la variable d'environnement ou 4000 par défaut
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
});