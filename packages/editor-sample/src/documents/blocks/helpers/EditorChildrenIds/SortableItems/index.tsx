import React, { useEffect, useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { Box } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { useDocument } from '../../../../editor/EditorContext';

import classes from './styles.module.scss';

type SortableItemProps = {
	id: string;
	children: React.ReactNode;
	isDropSuccess?: boolean;
	blockId: string;
};

export default function SortableItem({
	id,
	children,
	isDropSuccess = false,
	blockId,
}: SortableItemProps) {
	const document = useDocument();
	const [isAnimating, setIsAnimating] = useState(false);

	const parentId = blockId.split('-column-')?.[0] || '';

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: { type: 'block', parentType: document[parentId]?.type },
	});

	// Handle drop success animation
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isDropSuccess) {
			setIsAnimating(true);
			timer = setTimeout(() => setIsAnimating(false), 600);
		}
		return () => clearTimeout(timer);
	}, [isDropSuccess]);

	const baseTransform = CSS.Transform.toString(transform);
	let finalTransform = baseTransform;

	if (isAnimating) {
		finalTransform = `${baseTransform} scale(1.02)`;
	}

	const style: React.CSSProperties = {
		transform: finalTransform,
		transition: isDragging
			? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
			: transition,
		opacity: isDragging ? 0.4 : 1,
		position: 'relative',
		zIndex: isDragging ? 1000 : 1,
		touchAction: 'none',
		willChange: 'transform, opacity, box-shadow',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`${classes.container} ${document[id].type === 'Rte' ? classes.rte_block : ''} ${
				isAnimating ? classes.success_animation : ''
			}`}
		>
			{children}

			<div {...attributes} {...listeners} className={classes.drag}>
				<DragIndicatorIcon style={{ color: 'white' }} />
			</div>
		</div>
	);
}
