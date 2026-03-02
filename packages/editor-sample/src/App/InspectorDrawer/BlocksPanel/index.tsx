import { Box } from '@mui/material';

import { BUTTONS } from '../../../constant/buttons';
import BaseSidebarPanel from '../ConfigurationPanel/input-panels/helpers/BaseSidebarPanel';

import Block from './Block';

function BlocksPanel() {
	return (
		<BaseSidebarPanel title="Blocks">
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr',
					gap: 1,
				}}
			>
				{BUTTONS.map((k, i) => (
					<Block
						key={i}
						icon={k.icon}
						label={k.label}
						block={k.block}
					/>
				))}
			</Box>
		</BaseSidebarPanel>
	);
}

export default BlocksPanel;
