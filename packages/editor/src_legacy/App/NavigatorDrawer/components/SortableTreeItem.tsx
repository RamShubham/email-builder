import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	ChevronRight as ChevronRightIcon,
	DragIndicator as DragIcon,
} from '@mui/icons-material';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';

import BLOCK_ICON_MAPPING from '../../../constant/blockIcon';

import styles from './SortableTreeItem.module.scss';

type SortableTreeItemProps = {
	item: {
		id: string;
		type: string;
		children: any[];
	};
	level: number;
	handleBlockClick: (id: string) => void;
	toggleExpanded: (id: string) => void;
	isExpanded: boolean;
};

function SortableTreeItem({
	item,
	level,
	handleBlockClick,
	toggleExpanded,
	isExpanded,
}: SortableTreeItemProps) {
	const hasChildren = item.children.length > 0;

	const {
		attributes,
		listeners,
		setNodeRef,
		transition,
		transform,
		isDragging,
	} = useSortable({ id: item.id });

	// Handle selection animation
	const handleClick = () => {
		if (!item.id.includes('column')) {
			handleBlockClick(item.id);
		}
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.8 : 1,
		position: 'relative' as const,
		zIndex: isDragging ? 999 : 1,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<ListItem
				className={!item.id.includes('column') ? styles.container : ''}
				sx={{
					pl: level * 2 + 1,
					cursor: 'pointer',
					gap: 1,
				}}
				onClick={handleClick}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						minWidth: 36,
					}}
				>
					{hasChildren ? (
						<IconButton
							size="small"
							onClick={() => {
								// e.stopPropagation();
								toggleExpanded(item.id);
							}}
							sx={{
								p: 0.5,
								mr: 0.5,
								transition:
									'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
								transform: isExpanded
									? 'rotate(90deg)'
									: 'rotate(0deg)',
								'&:hover': {
									backgroundColor: 'rgba(33, 150, 243, 0.1)',
									transform: isExpanded
										? 'rotate(90deg) scale(1.1)'
										: 'rotate(0deg) scale(1.1)',
								},
							}}
						>
							<ChevronRightIcon fontSize="small" />
						</IconButton>
					) : (
						<Box sx={{ width: 20 }} /> // Spacer for alignment when no icon
					)}

					{BLOCK_ICON_MAPPING[item.type]}
				</Box>

				<ListItemText
					primary={item.type}
					primaryTypographyProps={{
						variant: 'body2',
						noWrap: true,
					}}
					className={!item.id.includes('column') ? styles.text : ''}
				/>

				{!item.id.includes('column') ? (
					<DragIcon
						fontSize="small"
						className={styles.drag_handle}
						sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}
						{...attributes}
						{...listeners}
					/>
				) : null}
			</ListItem>
		</div>
	);
}

export default SortableTreeItem;
