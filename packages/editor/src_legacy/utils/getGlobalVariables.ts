import isEmpty from 'lodash/isEmpty';

import { TEditorConfiguration } from '../documents/editor/core';
const getGlobalVariables = ({
	document,
}: {
	document: TEditorConfiguration;
}) => {
	const globalVariables = {};

	for (const [blockId, block] of Object.entries(document)) {
		const { data } = block;

		if (blockId === 'root') {
			continue;
		}

		const { props } = data || {};

		for (const key in props) {
			const value = props[key];

			if (typeof value === 'string') {
				const matches = [...value.matchAll(/{{(.*?)}}/g)];

				if (isEmpty(matches)) {
					continue;
				}

				const variables = matches.map((match) => match[1]);

				variables.forEach((variable) => {
					globalVariables[variable] = '';
				});
			}
		}
	}

	return globalVariables;
};

export default getGlobalVariables;
