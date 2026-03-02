import { TEditorConfiguration } from '../documents/editor/core';

const findVariable = ({
	globalVariables,
	document,
}: {
	globalVariables: Record<string, any>;
	document: TEditorConfiguration;
}) => {
	const updatedVariables: Record<string, any> = {};

	for (const block in document) {
		if (block === 'root') continue;

		const blockObj = document[block];

		if (!blockObj?.data) continue;

		const { props, template } = blockObj.data;

		const contentData = template ?? props;

		if (!contentData) continue;

		for (const key in contentData) {
			const val = contentData[key];

			if (typeof val !== 'string') continue;

			const matches = [...val.matchAll(/{{(.*?)}}/g)];
			if (matches.length === 0) continue;

			const variables = matches.map((match) => match[1]);

			variables.forEach((variable) => {
				if (variable) {
					updatedVariables[variable] =
						globalVariables[variable] || '';
				}
			});
		}
	}

	return updatedVariables;
};

export default findVariable;
