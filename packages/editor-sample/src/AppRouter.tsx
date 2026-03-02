import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import AuthRoute from './AuthRoute';

function NotFound() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
				<p className="mt-2 text-sm text-gray-500">Navigate to /template or /asset with required parameters.</p>
			</div>
		</div>
	);
}

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/template" element={<AuthRoute component={App} />} />
				<Route path="/asset" element={<AuthRoute component={App} />} />
				<Route path="/dev" element={<App />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default AppRouter;
