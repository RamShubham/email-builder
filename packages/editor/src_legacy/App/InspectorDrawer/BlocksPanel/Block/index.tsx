import { useDraggable } from '@dnd-kit/core';
import { Box, SxProps, Typography } from '@mui/material';

import { TEditorBlock } from '../../../../documents/editor/core';

const BUTTON_SX: SxProps = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	m: 1,
	cursor: 'grab',
};
const ICON_SX: SxProps = {
	mb: 0.75,
	width: '100%',
	bgcolor: 'cadet.200',
	display: 'flex',
	justifyContent: 'center',
	p: 1,
	border: '1px solid',
	borderColor: 'cadet.300',
};

function Block({
	icon,
	label,
	block,
}: {
	icon: React.ReactNode;
	label: string;
	block: () => TEditorBlock;
}) {
	const { setNodeRef, attributes, listeners } = useDraggable({
		id: `inspect-block-${label}`,
		data: { type: 'blockElement', block: block() },
	});

	return (
		<Box sx={BUTTON_SX} ref={setNodeRef} {...attributes} {...listeners}>
			<Box sx={ICON_SX}>{icon}</Box>
			<Typography variant="body2">{label}</Typography>
		</Box>
	);
}

export default Block;
