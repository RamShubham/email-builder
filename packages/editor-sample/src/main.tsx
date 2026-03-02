import './styles/globals.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import AppRouter from './AppRouter';
import { TooltipProvider } from './components/ui/tooltip';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
	// <TinyCommandAuthController
	// 	loginUrl={process.env.REACT_APP_LOGIN_URL}
	// 	clientId={process.env.REACT_APP_KEYCLOAK_RESOURCE}
	// 	realm={process.env.REACT_APP_KEYCLOAK_REALM}
	// 	serverUrl={process.env.REACT_APP_KEYCLOAK_AUTH_SERVER_URL}
	// 	assetServerUrl={process.env.REACT_APP_OUTE_SERVER}
	// >
	<TooltipProvider>
		<AppRouter />
		<Toaster position="top-right" richColors />
	</TooltipProvider>
	// </TinyCommandAuthController>
);
