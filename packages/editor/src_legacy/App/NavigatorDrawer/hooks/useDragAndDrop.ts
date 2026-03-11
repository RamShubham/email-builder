import { useState } from 'react';

import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import {
	TEditorBlock,
	TEditorConfiguration,
} from '../../../documents/editor/core';
import { updateDocument } from '../../../documents/editor/EditorContext';

type UseDragAndDropProps = {
	document: TEditorConfiguration;
	blockTree: any;
};

const getChildrenIds = (block: TEditorBlock, sourceItem: any) => {
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

const updateChildrenIds = (
	block: TEditorBlock,
	childrenIds: string[],
	sourceItem: any
) => {
	if (block.type === 'EmailLayout') {
		block.data.childrenIds = childrenIds;
		return block;
	}

	if (block.type === 'Container') {
		block.data.props.childrenIds = childrenIds;
		return block;
	}

	if (block.type === 'ColumnsContainer') {
		block.data.props.columns[sourceItem.columnIndex].childrenIds =
			childrenIds;
		return block;
	}

	return block;
};

export function useDragAndDrop({ document, blockTree }: UseDragAndDropProps) {
	const [activeItem, setActiveItem] = useState<any>(null);

	const findBlockInTree = (tree: any, id: string) => {
		if (!tree) return null;
		if (tree.id === id) return tree;

		for (const child of tree.children) {
			const found = findBlockInTree(child, id);
			if (found) return found;
		}

		return null;
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activeItem = findBlockInTree(blockTree, active.id.toString());

		setActiveItem(activeItem);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id === over?.id || !over || !activeItem) {
			setActiveItem(null);
			return;
		}

		const sourceId = active.id.toString();
		const targetId = over.id.toString();

		const sourceItem = findBlockInTree(blockTree, sourceId);
		const targetItem = findBlockInTree(blockTree, targetId);

		if (!sourceItem || !targetItem) {
			setActiveItem(null);
			return;
		}

		// Create a copy of the document to modify
		const newDocument = { ...document };

		const sourceParentBlock = newDocument[sourceItem.parentId];

		const sourceChildrenIds = getChildrenIds(sourceParentBlock, sourceItem);

		if (sourceChildrenIds.includes(targetId)) {
			const updatedChildrenIds: string[] = arrayMove(
				sourceChildrenIds,
				sourceChildrenIds.indexOf(sourceId),
				sourceChildrenIds.indexOf(targetId)
			);

			updateChildrenIds(
				sourceParentBlock,
				updatedChildrenIds,
				sourceItem
			);

			updateDocument(newDocument as TEditorConfiguration);
			setActiveItem(null);

			return;
		}

		// Remove the block from its current parent
		if (sourceItem) {
			const parentBlock = newDocument[sourceItem.parentId];
			if (
				parentBlock.type === 'EmailLayout' &&
				parentBlock.data.childrenIds
			) {
				const updatedChildrenIds = parentBlock.data.childrenIds.filter(
					(id) => id !== sourceItem.id
				);
				parentBlock.data.childrenIds = updatedChildrenIds;
			} else if (
				parentBlock.type === 'Container' &&
				parentBlock.data.props?.childrenIds
			) {
				const updatedChildrenIds =
					parentBlock.data.props?.childrenIds.filter(
						(id) => id !== sourceItem.id
					);
				parentBlock.data.props.childrenIds = updatedChildrenIds;
			} else if (
				parentBlock.type === 'ColumnsContainer' &&
				parentBlock.data.props?.columns &&
				typeof sourceItem.columnIndex === 'number'
			) {
				const column =
					parentBlock.data.props.columns[sourceItem.columnIndex];
				if (column && column.childrenIds) {
					column.childrenIds = column.childrenIds.filter(
						(id) => id !== sourceItem.id
					);
				}
			}
		}

		// Add the block to its new parent
		if (targetItem) {
			const parentBlock = newDocument[targetItem.parentId];

			if (parentBlock) {
				let targetIndex = -1;

				if (
					parentBlock.type === 'EmailLayout' &&
					parentBlock.data.childrenIds
				) {
					targetIndex =
						parentBlock.data.childrenIds.indexOf(targetId);
					parentBlock.data.childrenIds.splice(
						targetIndex,
						0,
						sourceId
					);
				} else if (
					parentBlock.type === 'Container' &&
					parentBlock.data.props?.childrenIds
				) {
					targetIndex =
						parentBlock.data.props.childrenIds.indexOf(targetId);
					parentBlock.data.props.childrenIds.splice(
						targetIndex,
						0,
						sourceId
					);
				} else if (
					parentBlock.type === 'ColumnsContainer' &&
					parentBlock.data.props?.columns &&
					targetItem.columnIndex !== undefined
				) {
					const column =
						parentBlock.data.props.columns[targetItem.columnIndex];
					if (column && column.childrenIds) {
						targetIndex = column.childrenIds.indexOf(targetId);
						column.childrenIds.splice(targetIndex, 0, sourceId);
					}
				}
			}
		}

		updateDocument(newDocument as TEditorConfiguration);
		setActiveItem(null);
	};

	return {
		activeItem,
		handleDragStart,
		handleDragEnd,
	};
}
