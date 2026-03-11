import isEmpty from 'lodash/isEmpty';
import { showAlert } from 'oute-ds-alert';
import { useCallback, useEffect, useRef, useState } from 'react';

import Intercom, { show, shutdown } from '@intercom/messenger-js-sdk';
import { useAuth } from '@oute/oute-ds.common.molecule.tiny-auth';

import {
	ASSET_KEY,
	PARENT_KEY,
	PROJECT_KEY,
	QUERY_KEY,
	WORKSPACE_KEY,
} from '../../constant/keys';
import {
	setDocument,
	setGlobalLoader,
	setIds,
	setVariables,
	updateVariables,
	useDocument,
	useIds,
	useVariables,
} from '../../documents/editor/EditorContext';
import mailSDKServices from '../../sdk/mailSDKService';
import encodeParams from '../../utils/encodeParams';
import findVariable from '../../utils/findVariable';
import generateHtml from '../../utils/generateHtml';

const useNavbar = () => {
	const [loading, setLoading] = useState(false);
	const [templateName, setTemplateName] = useState('Untitled Template');

	const hasInitialized = useRef(false);

	const { user } = useAuth();

	const document = useDocument();
	const globalVariables = useVariables();

	const { workspaceId, parentId, projectId, assetId } = useIds();

	const onSaveSuccessHandler = useCallback(
		({ response, hideAlert = false }) => {
			if (response?.status === 'success') {
				const { asset_id = '', asset = {} } = response.result || {};
				setIds({ assetId: asset_id });

				const finalTemplateName = asset?.name || templateName;

				setTemplateName(finalTemplateName);

				window.document.title = `${finalTemplateName} | TinyEmails`;

				window.history.replaceState(
					'',
					'',
					`/asset/?${QUERY_KEY}=${encodeParams({
						[WORKSPACE_KEY]: workspaceId,
						[PROJECT_KEY]: projectId,
						[PARENT_KEY]: parentId,
						[ASSET_KEY]: response.result.asset_id,
					})}`
				);

				if (!hideAlert) {
					showAlert({
						message: `${finalTemplateName} template saved successfully.`,
						type: 'success',
					});
				}

				window.parent.postMessage(
					{
						type: 'EMAIL_TEMPLATE_SAVED',
						payload: {
							message: JSON.stringify({
								status: 'success',
								data: {
									assetId: response.result.asset_id,
									name: finalTemplateName,
								},
							}),
						},
					},
					'*' // Replace "" with specific origin for security
				);
			}
		},
		[parentId, projectId, templateName, workspaceId]
	);

	const onSaveHandler = useCallback(
		async ({ hideAlert = false, additionalData = {} }) => {
			const updatedVariables = findVariable({
				globalVariables,
				document,
			});

			updateVariables(updatedVariables);

			try {
				setLoading(true);
				const payload = {
					parent_id: parentId,
					project_id: projectId,
					workspace_id: workspaceId,
					name: templateName,
					type: 'FILE',
					annotation: 'EMAIL_TEMPLATE',
					share_to_all: true,
					json: document,
					html: generateHtml(document),
					inputs: Object.keys(updatedVariables).map((variable) => ({
						key: variable,
					})),
					...(assetId && { asset_id: assetId }),
					...additionalData,
				};

				const response = await mailSDKServices.save(payload);

				onSaveSuccessHandler({ response, hideAlert });
			} catch (error: any) {
				if (!hideAlert) {
					showAlert({
						message: error?.message || 'Something Went Wrong',
						type: 'error',
					});
				}
			} finally {
				setLoading(false);
			}
		},
		[
			assetId,
			document,
			globalVariables,
			onSaveSuccessHandler,
			parentId,
			projectId,
			templateName,
			workspaceId,
		]
	);

	const onGetEmailTemplateSuccessHandler = ({ response }) => {
		const { json = {}, inputs = [], asset = {} } = response.result;

		if (json?.root) {
			setDocument(json);
		}

		if (!isEmpty(inputs)) {
			const variables = {};

			inputs.forEach((input) => {
				variables[input.key] = '';
			});

			setVariables(variables);
		}

		if (asset?.name) {
			setTemplateName(asset.name);
			window.document.title = `${asset.name} | TinyEmails`;
		}
	};

	const getEmailTemplate = useCallback(async () => {
		try {
			setLoading(true);
			const response = await mailSDKServices.findOne({
				asset_id: assetId,
			});

			if (response?.status === 'success') {
				onGetEmailTemplateSuccessHandler({ response });
			}
		} catch (error) {
			console.log('error >>', error);
		} finally {
			setLoading(false);
		}
	}, [assetId]);

	const handleInitialLoad = useCallback(async () => {
		setGlobalLoader(true);
		try {
			if (assetId) {
				await getEmailTemplate();
			} else {
				await onSaveHandler({ hideAlert: true });
			}
		} finally {
			setGlobalLoader(false);
		}
	}, [assetId, getEmailTemplate, onSaveHandler]);

	useEffect(() => {
		if (!hasInitialized.current) {
			handleInitialLoad();
			hasInitialized.current = true;
		}
	}, [handleInitialLoad]);

	useEffect(() => {
		if (user?.name && user?.email) {
			Intercom({
				app_id: process.env.REACT_APP_INTERCOM_ID || '',
				name: user.name,
				email: user.email,
				hide_default_launcher: true,
			});
		}

		return () => {
			shutdown();
		};
	}, [user?.name, user?.email]);

	return {
		loading,
		onSaveHandler,
		templateName,
		setTemplateName,
		show,
	};
};

export default useNavbar;
