// use insertBlockElements
// import { useState } from 'react';

import {
	DragEndEvent,
	// DragOverEvent,
	// DragStartEvent,
	// UniqueIdentifier,
	useDndMonitor,
} from '@dnd-kit/core';

// import { arrayMove } from '@dnd-kit/sortable';
import {
	TEditorBlock,
	// TEditorConfiguration
} from '../../../../editor/core';
// import { EditorChildrenChange } from '..';

const useDragAndDrop = ({
	childrenIds,
	// document,
	// onChange,
	insertBlock,
	appendBlock,
	blockId,
}: {
	childrenIds: string[] | null | undefined;
	// document: TEditorConfiguration;
	// onChange: (val: EditorChildrenChange) => void;
	insertBlock: (block: TEditorBlock, index: number) => void;
	appendBlock: (block: TEditorBlock) => void;
	blockId: string;
}) => {
	// const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	// const [dragOverId, setDragOverId] = useState<UniqueIdentifier | null>(null);

	// const handleDragStart = (event: DragStartEvent) => {
	// 	setActiveId(event.active.id);
	// };

	// const resetDragState = () => {
	// 	setActiveId(null);
	// 	setDragOverId(null);
	// };

	// const handleRearrangeElement = ({
	// 	activeId,
	// 	overId,
	// }: {
	// 	activeId: string;
	// 	overId: string;
	// }) => {
	// 	if (activeId === overId || !childrenIds) {
	// 		return;
	// 	}

	// 	const oldIndex = childrenIds.indexOf(activeId);
	// 	const newIndex = childrenIds.indexOf(overId);

	// 	if (oldIndex !== -1 && newIndex !== -1) {
	// 		const newChildrenIds = arrayMove(childrenIds, oldIndex, newIndex);

	// 		onChange({
	// 			blockId: activeId,
	// 			block: document[activeId] as TEditorBlock, // We're not changing the block, just its position
	// 			childrenIds: newChildrenIds,
	// 		});
	// 	}
	// };

	const handleInsertElement = ({
		overId,
		block,
	}: {
		overId: string;
		block: TEditorBlock;
	}) => {
		if (!block) {
			return;
		}

		if (
			[
				`${blockId}-last-drop-zone`,
				`${blockId}-first-drop-zone`,
			].includes(overId)
		) {
			appendBlock(block);
			return;
		}

		if (overId.startsWith('drop-zone-')) {
			const targetId = overId.split('drop-zone-')[1] ?? '';
			const insertIndex = childrenIds?.indexOf(targetId) ?? -1;

			if (block && insertIndex !== -1) {
				insertBlock(block, insertIndex);
			}
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		const activeId = active.id.toString();
		const overId = over?.id.toString() ?? '';
		const block = active.data.current?.block;

		if (!overId) {
			// resetDragState();
			return;
		}

		if (activeId.startsWith('inspect-block-')) {
			handleInsertElement({ overId, block });
		}

		// if (activeId.startsWith('block-')) {
		// 	handleRearrangeElement({ activeId, overId });
		// } else {
		// 	handleInsertElement({ overId, block });
		// }

		// resetDragState();
	};

	// const handleDragOver = (event: DragOverEvent) => {
	// 	const { over } = event;
	// 	console.log('over >>', over, blockId);

	// 	setDragOverId(over?.id ?? null);
	// };

	useDndMonitor({
		// onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
		// onDragOver: handleDragOver,
	});

	// return { activeId, dragOverId };
};

export default useDragAndDrop;
