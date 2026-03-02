// use dragAndDrop

import { useState } from 'react';

import {
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	// UniqueIdentifier,
	useDndMonitor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { TEditorBlock } from '../../../../editor/core';
import { updateDocument, useDocument } from '../../../../editor/EditorContext';

const getChildrenIds = ({
	block,
	sourceItem,
}: {
	block: TEditorBlock;
	sourceItem: any;
}) => {
	if (block.type === 'EmailLayout') {
		return block.data.childrenIds;
	}

	if (block.type === 'Container') {
		return block.data.props?.childrenIds;
	}

	if (block.type === 'ColumnsContainer') {
		return block.data.props?.columns?.[sourceItem.columnIndex]?.childrenIds;
	}
};

const updateChildrenIds = ({
	block,
	updatedChildrenIds,
	sourceItem,
}: {
	block: TEditorBlock;
	updatedChildrenIds: string[] | any;
	sourceItem: any;
}) => {
	if (block.type === 'EmailLayout') {
		block.data.childrenIds = updatedChildrenIds;
		return block;
	}

	if (block.type === 'Container') {
		block.data.props.childrenIds = updatedChildrenIds;
		return block;
	}

	if (block.type === 'ColumnsContainer') {
		block.data.props.columns[sourceItem.columnIndex].childrenIds =
			updatedChildrenIds;
		return block;
	}

	return block;
};

const useDnd = ({ flattenedDocument }) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [dragOverId, setDragOverId] = useState<string | null>(null);

	const document = useDocument();

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id.toString());
	};

	const resetDragState = () => {
		setActiveId(null);
		setDragOverId(null);
	};

	const handleRearrangeElement = ({ sourceItem, targetItem }) => {
		const updatedDocument = { ...document };

		const sourceParentBlock = updatedDocument[sourceItem.parentId];
		const sourceChildrenIds = getChildrenIds({
			block: sourceParentBlock,
			sourceItem,
		});

		const targetParentBlock = updatedDocument[targetItem.parentId];
		const targetChildrenIds = getChildrenIds({
			block: targetParentBlock,
			sourceItem: targetItem,
		});

		if (sourceChildrenIds.includes(targetItem.id)) {
			const reorderedChildrenIds = arrayMove(
				sourceChildrenIds,
				sourceItem.index,
				targetItem.index
			);

			sourceParentBlock.data.childrenIds = reorderedChildrenIds;
			updateChildrenIds({
				block: sourceParentBlock,
				updatedChildrenIds: reorderedChildrenIds,
				sourceItem,
			});
		} else {
			sourceChildrenIds.splice(sourceItem.index, 1);
			targetChildrenIds.splice(targetItem.index, 0, sourceItem.id);
		}

		updateDocument(updatedDocument);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		const activeId = active.id.toString();
		const overId = over?.id.toString() ?? '';

		const sourceItem = flattenedDocument.find(
			(item) => item.id === activeId
		);

		const targetItem = flattenedDocument.find((item) => item.id === overId);

		if (!sourceItem || !targetItem) {
			resetDragState();
			return;
		}

		if (activeId.startsWith('block-')) {
			handleRearrangeElement({
				sourceItem,
				targetItem,
			});
		}

		resetDragState();
	};

	const handleDragOver = (event: DragOverEvent) => {
		setDragOverId(event.over?.id.toString() ?? null);
	};

	useDndMonitor({
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
		onDragOver: handleDragOver,
	});

	return { activeId, dragOverId };
};

export default useDnd;
