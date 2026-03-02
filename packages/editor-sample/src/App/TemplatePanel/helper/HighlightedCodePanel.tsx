import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { html, json } from './highlighters';

type TextEditorPanelProps = {
	type: 'json' | 'html' | 'javascript';
	value: string;
};
export default function HighlightedCodePanel({
	type,
	value,
}: TextEditorPanelProps) {
	const [code, setCode] = useState<string | null>(null);

	useEffect(() => {
		switch (type) {
			case 'html':
				html(value).then(setCode);
				return;
			case 'json':
				json(value).then(setCode);
				return;
		}
	}, [setCode, value, type]);

	if (code === null) {
		return null;
	}

	return (
		<Box
			sx={{
				opacity: 1,
				animation: 'highlightFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				'@keyframes highlightFadeIn': {
					from: {
						opacity: 0.7,
						transform: 'scale(0.98)',
					},
					to: {
						opacity: 1,
						transform: 'scale(1)',
					},
				},
			}}
		>
			<pre
				data-testid={`${type}-tab-content`}
				style={{
					margin: 0,
					padding: 16,
					cursor: 'pointer',
				}}
				dangerouslySetInnerHTML={{ __html: code }}
				onClick={(ev) => {
					const s = window.getSelection();
					if (s === null) {
						return;
					}
					s.selectAllChildren(ev.currentTarget);
				}}
			/>
		</Box>
	);
}
