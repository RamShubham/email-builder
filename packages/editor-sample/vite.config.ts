import dotenv from 'dotenv';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

dotenv.config(); // load env vars from .env

export default defineConfig({
        plugins: [react()],
        base: '/',
        define: {
                'process.env': {
                        ...process.env,
                },
        },
        envPrefix: 'REACT_APP_',
        resolve: {
                dedupe: ['react', 'react-dom'],
        },
        build: {
                rollupOptions: {
                        treeshake: true,
                },
        },
        server: {
                host: '0.0.0.0',
                port: 5000,
                allowedHosts: 'all',
        },
});
