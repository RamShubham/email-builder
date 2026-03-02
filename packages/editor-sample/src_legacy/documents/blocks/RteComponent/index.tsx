import Rte from 'block-rte';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import { setDocument, useDocument } from '../../editor/EditorContext';

function RteComponent({ props, style }) {
	const blockId = useCurrentBlockId();

	const document = useDocument();

	const handleBlur = ({ content, html }) => {
		const block = document[blockId];

		setDocument({
			[blockId]: {
				...block,
				data: {
					...block.data,
					props: {
						content,
						html,
					},
					template: {
						content,
						html,
					},
				},
			},
		});
	};

	return <Rte props={{ ...props }} style={style} onChange={handleBlur} />;
}

export default RteComponent;
