import dotenv from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

dotenv.config();

export default defineConfig({
        plugins: [react()],
        base: '/',
        define: {
                'process.env': JSON.stringify(
                        Object.fromEntries(
                                Object.entries(process.env).filter(([key]) =>
                                        key.startsWith('REACT_APP_')
                                )
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
                allowedHosts: true,
                proxy: {
                        '/api': {
                                target: 'http://localhost:3040',
                                changeOrigin: true,
                                configure: (proxy) => {
                                        proxy.on(
                                                'proxyReq',
                                                (proxyReq, req) => {
                                                        console.log(
                                                                `[vite-proxy] --> ${req.method} ${req.url} → http://localhost:3040${req.url}`
                                                        );
                                                }
                                        );
                                        proxy.on(
                                                'proxyRes',
                                                (proxyRes, req) => {
                                                        console.log(
                                                                `[vite-proxy] <-- ${req.method} ${req.url} status=${proxyRes.statusCode}`
                                                        );
                                                }
                                        );
                                        proxy.on('error', (err, req) => {
                                                console.error(
                                                        `[vite-proxy] ERROR ${req.method} ${req.url}:`,
                                                        err.message
                                                );
                                        });
                                },
                        },
                },
        },
});
