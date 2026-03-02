import { serverConfig } from 'oute-ds-utils';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import clarity from '@microsoft/clarity';
import { useAuth } from '@oute/oute-ds.common.molecule.tiny-auth';

import App from './App';
import AuthRoute from './AuthRoute';
import Redirect from './Redirect';

function AppRouter() {
	const { user } = useAuth();

	useEffect(() => {
		clarity.init(process.env.REACT_APP_CLARITY_ID || '');
		clarity.identify(user.sub, user.sub, '', user.email);
		clarity.setTag('email', user.email);
		clarity.setTag('user_id', user.sub);
	}, [user?.sub, user?.email]);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/template"
					element={<AuthRoute component={App} />}
				/>

				<Route path="/asset" element={<AuthRoute component={App} />} />

				<Route
					path="*"
					element={<Redirect url={serverConfig.WC_LANDING_URL} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default AppRouter;
