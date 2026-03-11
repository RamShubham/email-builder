import { Fragment, useEffect, useState } from 'react';

import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import generateId from '../../../../utils/generateId';
import { TEditorBlock } from '../../../editor/core';
import EditorBlock from '../../../editor/EditorBlock';
import { useActiveId, useDragOverId } from '../../../editor/EditorContext';

import AddBlockButton from './AddBlockMenu';
import DropZone from './DropZone';
import useDragAndDrop from './hook/useDragAndDrop';
import SortableItem from './SortableItems';

export type EditorChildrenChange = {
	blockId: string;
	block: TEditorBlock;
	childrenIds: string[];
};

export type EditorChildrenIdsProps = {
	childrenIds: string[] | null | undefined;
	onChange: (val: EditorChildrenChange) => void;
	blockId: string;
};

export default function EditorChildrenIds({
	childrenIds,
	onChange,
	blockId,
}: EditorChildrenIdsProps) {
	const [dropSuccess, setDropSuccess] = useState<string | null>(null);

	const appendBlock = (block: TEditorBlock) => {
		const blockId = generateId();
		setDropSuccess(blockId);
		return onChange({
			blockId,
			block,
			childrenIds: [...(childrenIds || []), blockId],
		});
	};

	const insertBlock = (block: TEditorBlock, index: number) => {
		const blockId = generateId();
		const newChildrenIds = [...(childrenIds || [])];
		newChildrenIds.splice(index, 0, blockId);
		setDropSuccess(blockId);
		return onChange({
			blockId,
			block,
			childrenIds: newChildrenIds,
		});
	};

	const activeId = useActiveId();
	const dragOverId = useDragOverId();

	useDragAndDrop({
		childrenIds,
		insertBlock,
		appendBlock,
		blockId,
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (dropSuccess) {
			timer = setTimeout(() => setDropSuccess(null), 600);
		}
		return () => clearTimeout(timer);
	}, [dropSuccess]);

	return (
		<>
			{!childrenIds || childrenIds.length === 0 ? (
				<>
					<AddBlockButton placeholder onSelect={appendBlock} />
					<DropZone
						id={`${blockId}-first-drop-zone`}
						dragOverId={dragOverId}
						activeId={activeId}
						isEdges
					/>
				</>
			) : (
				<>
					<SortableContext
						items={childrenIds}
						strategy={verticalListSortingStrategy}
						id={`${blockId}-sortable-context`}
						data-testid={`${blockId}-sortable-context`}
					>
						{childrenIds.map((childId, i) => (
							<Fragment key={childId}>
								<AddBlockButton
									blockIds={[childId, childrenIds[i - 1]]}
									onSelect={(block) => insertBlock(block, i)}
								/>
								<DropZone
									id={childId}
									dragOverId={dragOverId}
									activeId={activeId}
								/>
								<SortableItem
									id={childId}
									isDropSuccess={dropSuccess === childId}
									blockId={blockId}
								>
									<EditorBlock id={childId} />
								</SortableItem>
							</Fragment>
						))}
					</SortableContext>

					<AddBlockButton
						onSelect={appendBlock}
						blockIds={childrenIds.slice(-1)}
					/>
					<DropZone
						id={`${blockId}-last-drop-zone`}
						dragOverId={dragOverId}
						activeId={activeId}
						isEdges
					/>
				</>
			)}
		</>
	);
}
