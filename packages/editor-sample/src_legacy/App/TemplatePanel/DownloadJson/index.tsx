import React, { useMemo } from 'react';

import { FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';

export default function DownloadJson() {
	const doc = useDocument();
	const href = useMemo(() => {
		return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
	}, [doc]);
	return (
		<Tooltip title="Download JSON file">
			<IconButton
				href={href}
				download="emailTemplate.json"
				data-testid="download-json-button"
				sx={{
					transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
					borderRadius: '0.375rem',

					'&:hover': {
						transform: 'scale(1.1) translateY(-2px)',
						backgroundColor: 'rgba(33, 33, 33, 0.1)',

						'& .MuiSvgIcon-root': {
							color: '#333',
						},
					},
				}}
			>
				<FileDownloadOutlined fontSize="small" />
			</IconButton>
		</Tooltip>
	);
}
