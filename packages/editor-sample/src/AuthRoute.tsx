import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
	ASSET_KEY,
	PARENT_KEY,
	PROJECT_KEY,
	QUERY_KEY,
	WORKSPACE_KEY,
} from './constant/keys';
import { setIds } from './documents/editor/EditorContext';
import decodeParams from './utils/decodeParams';

function AuthRoute({ component: Component }) {
	const [valid, setValid] = useState(false);

	const [searchParams] = useSearchParams();

	const navigate = useNavigate();

	const validateSession = useCallback(() => {
		setValid(false);
		const params = decodeParams(searchParams?.get(QUERY_KEY)) || {};

		setIds({
			workspaceId: params[WORKSPACE_KEY],
			projectId: params[PROJECT_KEY],
			parentId: params[PARENT_KEY],
			assetId: params[ASSET_KEY],
		});
		setValid(true);
	}, [searchParams]);

	useEffect(() => {
		if (!searchParams.get(QUERY_KEY)) {
			navigate('/redirect-to-home');
		}
	}, [navigate, searchParams]);

	useEffect(() => {
		validateSession();
	}, [validateSession]);

	return valid && <Component />;
}

export default AuthRoute;
