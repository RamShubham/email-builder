import posthog from "posthog-js";
import './styles/globals.css';

import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import AppRouter from './AppRouter';
import TinyCommandAuthController from './auth/tiny-auth-wrapper';
import { TooltipProvider } from './components/ui/tooltip';
import { initFbPixel } from './utils/facebookPixel';
import { initGoogleAds } from './utils/googleAds';

posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
  api_host: process.env.REACT_APP_POSTHOG_HOST,
  autocapture: true,
  capture_pageview: true,
  session_recording: {
    maskAllInputs: true,
  },
});

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

initFbPixel();
initGoogleAds();

root.render(
	<TinyCommandAuthController
		loginUrl={process.env.REACT_APP_LOGIN_URL}
		clientId={process.env.REACT_APP_KEYCLOAK_RESOURCE}
		realm={process.env.REACT_APP_KEYCLOAK_REALM}
		serverUrl={process.env.REACT_APP_KEYCLOAK_AUTH_SERVER_URL}
		assetServerUrl={process.env.REACT_APP_OUTE_SERVER}
	>
		<TooltipProvider>
			<AppRouter />
			<Toaster position="top-right" richColors />
		</TooltipProvider>
	</TinyCommandAuthController>
);
