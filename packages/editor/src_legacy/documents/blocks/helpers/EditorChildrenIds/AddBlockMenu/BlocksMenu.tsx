import { Box, Menu } from '@mui/material';

import { BUTTONS } from '../../../../../constant/buttons';
import { TEditorBlock } from '../../../../editor/core';

import BlockButton from './BlockButton';

type BlocksMenuProps = {
	anchorEl: HTMLElement | null;
	setAnchorEl: (v: HTMLElement | null) => void;
	onSelect: (block: TEditorBlock) => void;
};
export default function BlocksMenu({
	anchorEl,
	setAnchorEl,
	onSelect,
}: BlocksMenuProps) {
	const onClose = () => {
		setAnchorEl(null);
	};

	const onClick = (block: TEditorBlock) => {
		onSelect(block);
		setAnchorEl(null);
	};

	if (anchorEl === null) {
		return null;
	}

	return (
		<Menu
			open
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			slotProps={{
				paper: {
					style: {
						borderRadius: '6px',
						boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.1)',
						border: '0.75px solid #CFD8DC',
					},
				},
			}}
		>
			<Box
				sx={{
					p: 1,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr 1fr',
				}}
			>
				{BUTTONS.map((k, i) => (
					<BlockButton
						key={i}
						label={k.label}
						icon={k.icon}
						onClick={() => onClick(k.block())}
					/>
				))}
			</Box>
		</Menu>
	);
}
