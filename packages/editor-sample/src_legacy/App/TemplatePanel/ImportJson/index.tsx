import React, { useState } from 'react';

import { FileUploadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import ImportJsonDialog from './ImportJsonDialog';

export default function ImportJson() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Tooltip title="Import JSON file">
				<IconButton
					onClick={() => setOpen(true)}
					data-testid="import-json-button"
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
					<FileUploadOutlined fontSize="small" />
				</IconButton>
			</Tooltip>

			{open ? <ImportJsonDialog onClose={() => setOpen(false)} /> : null}
		</>
	);
}
