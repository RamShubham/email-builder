import { useMemo } from 'react';

import { Box } from '@mui/material';

import { useDocument } from '../../documents/editor/EditorContext';
import swapPropsAndTemplate from '../../utils/swapPropsAndTemplate';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function JsonPanel() {
	const document = useDocument();
	const updateDocument = swapPropsAndTemplate(document);

	const code = useMemo(
		() => JSON.stringify(updateDocument, null, '  '),
		[updateDocument]
	);

	return (
		<Box
			sx={{
				opacity: 1,
				transform: 'translateY(0)',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				animation: 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'@keyframes fadeInUp': {
					from: {
						opacity: 0,
						transform: 'translateY(10px)',
					},
					to: {
						opacity: 1,
						transform: 'translateY(0)',
					},
				},
			}}
		>
			<HighlightedCodePanel type="json" value={code} />
		</Box>
	);
}
