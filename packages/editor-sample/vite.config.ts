import { resolve } from 'path';

import dotenv from 'dotenv';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

dotenv.config();

export default defineConfig({
        plugins: [react()],
        base: '/',
        define: {
                'process.env': JSON.stringify(
                        Object.fromEntries(
                                Object.entries(process.env).filter(([key]) => key.startsWith('REACT_APP_'))
                        )
                ),
        },
        envPrefix: 'REACT_APP_',
        resolve: {
                alias: {
                        '@': resolve(__dirname, './src'),
                },
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
                proxy: {
                        '/api': {
                                target: 'http://localhost:3001',
                                changeOrigin: true,
                        },
                },
        },
});
