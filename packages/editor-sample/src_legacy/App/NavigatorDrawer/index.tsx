import React from 'react';

import {
	closestCenter,
	DndContext,
	// DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { Box, Drawer, List, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import BlockTree from './components/BlockTree';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import useNavigatorDrawer from './hooks/useNavigatorDrawer';

export const NAVIGATOR_DRAWER_WIDTH = 240;

export default function NavigatorDrawer() {
	const samplesDrawerOpen = useSamplesDrawerOpen();

	const {
		document,
		toggleExpanded,
		handleBlockClick,
		blockTree,
		expandedBlocks,
	} = useNavigatorDrawer();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor)
	);

	const { handleDragStart, handleDragEnd } = useDragAndDrop({
		document,
		blockTree,
	});

	return (
		<Drawer
			variant="persistent"
			anchor="left"
			open={samplesDrawerOpen}
			sx={{
				width: samplesDrawerOpen ? NAVIGATOR_DRAWER_WIDTH : 0,
				'& .MuiPaper-elevation': {
					top: 'unset',
					height: 'calc(100% - 60px)',
				},
			}}
		>
			<Stack
				spacing={1}
				py={1}
				width={NAVIGATOR_DRAWER_WIDTH}
				height="100%"
				data-testid="navigator-panel"
			>
				<Typography variant="h6" component="h1" sx={{ p: 1.5, pb: 0 }}>
					Navigator
				</Typography>

				<Typography
					variant="caption"
					sx={{ px: 1.5, color: 'text.secondary' }}
				>
					Drag and drop to move blocks within this panel.
				</Typography>

				<Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						modifiers={[
							restrictToVerticalAxis,
							restrictToWindowEdges,
						]}
					>
						<List dense disablePadding>
							{blockTree && (
								<BlockTree
									items={blockTree.children}
									handleBlockClick={handleBlockClick}
									toggleExpanded={toggleExpanded}
									expandedBlocks={expandedBlocks}
								/>
							)}
						</List>

						{/* <DragOverlay
							adjustScale
							style={{ transformOrigin: '0 0' }}
						>
							{activeItem ? (
								<Box
									sx={{
										bgcolor: 'background.paper',
										borderColor: 'primary.main',
										borderRadius: 1,
										border: '1px solid',
										boxShadow: 2,
										p: 1,
										ml: 2,
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										maxWidth: NAVIGATOR_DRAWER_WIDTH - 50,
									}}
								>
									{BLOCK_ICON_MAPPING[activeItem.type]}
									<Typography variant="body2" noWrap>
										{activeItem.type}
									</Typography>
								</Box>
							) : null}
						</DragOverlay> */}
					</DndContext>
				</Box>
			</Stack>
		</Drawer>
	);
}
