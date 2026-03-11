import { useEffect, useState } from 'react';

import { TEditorBlock } from '../../../documents/editor/core';
import {
	setSelectedBlockId,
	useDocument,
} from '../../../documents/editor/EditorContext';

type BlockTreeItem = {
	id: string;
	type: string;
	children: BlockTreeItem[];
	parentId: string | null;
	columnIndex: number | null;
};

const useSampleDrawer = () => {
	const [blockTree, setBlockTree] = useState<BlockTreeItem | null>(null);
	const [expandedBlocks, setExpandedBlocks] = useState<
		Record<string, boolean>
	>({});

	const document = useDocument();

	const toggleExpanded = (blockId: string) => {
		setExpandedBlocks((prev) => ({
			...prev,
			[blockId]: Boolean(!prev[blockId]),
		}));
	};

	// Handle click on a block to select it
	const handleBlockClick = (blockId: string) => {
		setSelectedBlockId(blockId);
	};

	useEffect(() => {
		const buildBlockTree = () => {
			// Helper function to recursively build the tree
			const buildTree = (
				blockId: string,
				parentId?: string | null,
				columnIndex?: number | null
			): BlockTreeItem | null => {
				const block = document[blockId] as TEditorBlock;
				if (!block) return null;

				const children: BlockTreeItem[] = [];

				// Handle EmailLayout children
				if (block.type === 'EmailLayout' && block.data.childrenIds) {
					block.data.childrenIds.forEach((childId) => {
						const child = buildTree(childId, blockId);
						if (child) children.push(child);
					});
				}

				// Handle Container children
				if (
					block.type === 'Container' &&
					block.data.props?.childrenIds
				) {
					block.data.props.childrenIds.forEach((childId) => {
						const child = buildTree(childId, blockId);
						if (child) children.push(child);
					});
				}

				// Handle ColumnsContainer children
				if (
					block.type === 'ColumnsContainer' &&
					block.data.props?.columns
				) {
					block.data.props.columns.forEach((column, index) => {
						const columnChildren: BlockTreeItem = {
							id: `column-${index + 1}`,
							type: `Column ${index + 1}`,
							children: [],
							parentId: blockId,
							columnIndex: index,
						};

						if (column.childrenIds) {
							const childrenTree: BlockTreeItem[] = [];

							column.childrenIds.forEach((childId) => {
								const child = buildTree(
									childId,
									blockId,
									index
								);
								if (child) childrenTree.push(child);
							});

							columnChildren.children = childrenTree;
						}

						// If the columns count is 2, we don't want to show the third column
						if (
							block.data.props.columnsCount !== 2 ||
							index !== 2
						) {
							children.push(columnChildren);
						}
					});
				}

				return {
					id: blockId,
					type: block.type,
					children,
					parentId: parentId ?? null,
					columnIndex: columnIndex ?? null,
				};
			};

			return buildTree('root');
		};

		setBlockTree(buildBlockTree());
	}, [document]);

	return {
		toggleExpanded,
		handleBlockClick,
		blockTree,
		expandedBlocks,
		document,
	};
};

export default useSampleDrawer;
