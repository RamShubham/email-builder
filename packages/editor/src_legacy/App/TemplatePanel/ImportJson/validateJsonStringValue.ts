import {
	EditorConfigurationSchema,
	TEditorConfiguration,
} from '../../../documents/editor/core';

type TResult =
	| { error: string; data?: undefined }
	| { data: TEditorConfiguration; error?: undefined };

export default function validateTextAreaValue(value: string): TResult {
	let jsonObject = undefined;

	try {
		jsonObject = JSON.parse(value);
	} catch (e) {
		console.log('e', e);
		return { error: 'Invalid json' };
	}

	const parseResult = EditorConfigurationSchema.safeParse(jsonObject);
	console.log('parseResult', parseResult);
	if (!parseResult.success) {
		console.log('parseResult.error >>', parseResult.error);
		return { error: 'Invalid JSON schema' };
	}

	if (!parseResult.data.root) {
		return { error: 'Missing "root" node' };
	}

	return { data: parseResult.data };
}
