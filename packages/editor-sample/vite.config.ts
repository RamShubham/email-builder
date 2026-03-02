import { resolve } from 'path';

import dotenv from 'dotenv';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

dotenv.config();

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
		allowedHosts: [
			'638ed0b6-5fdd-441f-be3b-28f3f1c88c03-00-ku84qlk4abuh.pike.replit.dev',
		],
	},
});
