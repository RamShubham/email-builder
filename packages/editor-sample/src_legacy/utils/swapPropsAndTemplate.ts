import cloneDeep from 'lodash/cloneDeep';

function swapPropsAndTemplate(json) {
	const clonedJson = cloneDeep(json);

	for (const key in clonedJson) {
		const block = clonedJson[key];

		if (block?.data && 'props' in block.data && 'template' in block.data) {
			const temp = block.data.props;
			block.data.props = block.data.template;
			block.data.template = temp;
		}
	}

	return clonedJson;
}

export default swapPropsAndTemplate;
