import React, { useMemo } from 'react';

import { Box } from '@mui/material';

import { useDocument } from '../../documents/editor/EditorContext';
import generateHtml from '../../utils/generateHtml';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function HtmlPanel() {
	const document = useDocument();
	const code = useMemo(() => generateHtml(document), [document]);

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
			<HighlightedCodePanel type="html" value={code} />
		</Box>
	);
}
