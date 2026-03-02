declare global {
	interface Window {
		accessToken?: string;
		gtag?: (...args: any[]) => void;
		dataLayer?: any[];
	}
}

import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';
// import TinyCommandAuthController from '@oute/oute-ds.common.molecule.tiny-auth';
import * as Sentry from '@sentry/react';

import AppRouter from './AppRouter';
import theme from './theme';
import { initFbPixel } from './utils/facebookPixel';
import { initGoogleAds } from './utils/googleAds';

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DSN,
	integrations: [
		Sentry.browserTracingIntegration(),
		// Sentry.replayIntegration({
		//   maskAllText: false,
		//   blockAllMedia: false,
		// }),
		Sentry.replayCanvasIntegration(),
		Sentry.globalHandlersIntegration({
			onerror: true,
			onunhandledrejection: true,
		}),
		Sentry.breadcrumbsIntegration({
			console: true, // Capture console logs
			dom: true, // Capture DOM interactions
			fetch: true, // Capture fetch requests
			history: true, // Capture navigation events
			sentry: true, // Capture Sentry events
			xhr: true, // Capture XMLHttpRequest
		}),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: [
		// "localhost",
		/oute\.app/,
		// Exclude 'accounts.tinycommand.com' but include other 'tinycommand.com' URLs
		/^(?!.*accounts\.tinycommand\.com).*tinycommand\.com$/,
	],
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
	beforeSend(event) {
		if (window.location.hostname === 'localhost') {
			// Drop event if on localhost
			return null;
		}
		return event; // Otherwise send the event
	},
	enabled: process.env.REACT_APP_ENABLE_SENTRY === 'true',
	release: process.env.REACT_APP_SENTRY_RELEASE_ID,
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

initFbPixel();
initGoogleAds();

root.render(
	// <TinyCommandAuthController
	// 	loginUrl={process.env.REACT_APP_LOGIN_URL}
	// 	clientId={process.env.REACT_APP_KEYCLOAK_RESOURCE}
	// 	realm={process.env.REACT_APP_KEYCLOAK_REALM}
	// 	serverUrl={process.env.REACT_APP_KEYCLOAK_AUTH_SERVER_URL}
	// 	assetServerUrl={process.env.REACT_APP_OUTE_SERVER}
	// >
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<AppRouter />
	</ThemeProvider>
	// </TinyCommandAuthController>
);
