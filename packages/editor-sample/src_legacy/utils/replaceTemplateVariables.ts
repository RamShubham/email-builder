import isEmpty from 'lodash/isEmpty';

type Props = {
	[key: string]: any;
};

type GlobalVariables = {
	[key: string]: string;
};

export function replaceTemplateVariables(
	props: Props,
	globalVariables: GlobalVariables
) {
	if (!props) {
		return null;
	}

	if (isEmpty(globalVariables)) {
		return props;
	}

	return Object.fromEntries(
		Object.entries(props).map(([key, value]) => {
			if (typeof value !== 'string') return [key, value]; // Skip non-string values

			// Replace {{variable}} placeholders with actual values from globalVariables
			const updatedValue = value.replace(
				/{{(.*?)}}/g,
				(_, variableName) =>
					globalVariables[variableName]
						? globalVariables[variableName]
						: `{{${variableName}}}` // Keep unresolved placeholders
			);

			return [key, updatedValue];
		})
	);
}
