import isEmpty from 'lodash/isEmpty';
import { showAlert } from 'oute-ds-alert';
import { useEffect, useState } from 'react';

import { TEditorConfiguration } from '../../../documents/editor/core';
import {
	resetDocument,
	resetVariables,
	setTemplatePanelLoader,
	useDocument,
	useIds,
} from '../../../documents/editor/EditorContext';
import useRequest from '../../../hook/useRequest';
import getGlobalVariables from '../../../utils/getGlobalVariables';
const useTemplate = () => {
	const [prompt, setPrompt] = useState('');
	const { workspaceId } = useIds();

	const document = useDocument();

	const [{ loading }, generatetrigger] = useRequest(
		{
			method: 'post',
			url: '/api/template/generate',
		},
		{ manual: true }
	);

	const [{ loading: updateLoading }, updateTrigger] = useRequest(
		{
			method: 'post',
			url: '/api/template/update',
		},
		{ manual: true }
	);

	const onSuccessHandler = (template: TEditorConfiguration) => {
		resetDocument(template);
		const globalVariables = getGlobalVariables({
			document: template,
		});
		resetVariables(globalVariables);
	};

	const generateTemplate = async () => {
		try {
			const { data } = await generatetrigger({
				data: {
					prompt: prompt,
					workspaceId,
				},
			});

			onSuccessHandler(data.template);
			return data.template;
		} catch (error: any) {
			showAlert({
				message: 'Failed to generate template',
				type: 'error',
			});
		}
	};

	const updateTemplate = async () => {
		try {
			const { data } = await updateTrigger({
				data: {
					prompt: prompt,
					template: document,
					workspaceId,
				},
			});

			onSuccessHandler(data.template);
			return data.template;
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmitHandler = () => {
		if (loading || updateLoading) {
			return;
		}

		if (isEmpty(prompt)) {
			showAlert({
				message: 'Please enter a prompt',
				type: 'error',
			});
			return;
		}
		if (isEmpty(document.root.data.childrenIds)) {
			generateTemplate();
		} else {
			updateTemplate();
		}
	};

	useEffect(() => {
		setTemplatePanelLoader(loading || updateLoading);
	}, [loading, updateLoading]);

	return {
		onSubmitHandler,
		loading: loading || updateLoading,
		prompt,
		setPrompt,
	};
};

export default useTemplate;
