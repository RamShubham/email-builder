import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

import styles from './styles.module.scss';

function DropZone({
	id,
	dragOverId,
	activeId,
	isEdges = false,
}: {
	id: string;
	dragOverId: UniqueIdentifier | null;
	activeId: UniqueIdentifier | null;
	isEdges?: boolean;
}) {
	const dropZoneId = isEdges ? id : `drop-zone-${id}`;

	const { setNodeRef } = useDroppable({
		id: dropZoneId,
	});

	if (activeId?.toString().startsWith('block-')) {
		return null;
	}

	const isActive = dragOverId === dropZoneId;

	return (
		<div
			ref={setNodeRef}
			className={`${styles.container} ${
				isActive ? styles.valid_drop_zone : ''
			} ${isActive ? styles.pulsing : ''} ${isActive ? styles.magnetic : ''}`}
			style={{
				// Add magnetic effect - slight movement toward cursor
				transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
				transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
			}}
		>
			<div className={styles.drop_indicator}>
				<div className={styles.drop_line} />
				<span className={styles.drop_text}>Drop here</span>
			</div>
		</div>
	);
}

export default DropZone;
