import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { DragOverlay } from '@dnd-kit/core';

import FONT_FAMILY_MAPPING from '../../../constant/fontFamily';
import EditorBlock, { useCurrentBlockId } from '../../editor/EditorBlock';
import {
	setActiveId,
	setDocument,
	setDragOverId,
	setSelectedBlockId,
	useDocument,
} from '../../editor/EditorContext';
import BlockButtonOverlay from '../helpers/BlockButtonOverlay';
import EditorChildrenIds from '../helpers/EditorChildrenIds';
import useDnd from '../helpers/EditorChildrenIds/hook/useDnd';

import { EmailLayoutProps } from './EmailLayoutPropsSchema';

const getFlattenedDocument = (document) => {
	const result: any = [];

	function traverse({ id, parentId = null, index = 0, columnIndex = -1 }) {
		if (id !== 'root') {
			result.push({
				id,
				parentId,
				index,
				...(columnIndex >= 0 ? { columnIndex } : {}),
			});
		}

		const node = document[id];
		if (!node) return;

		if (node.type === 'EmailLayout' && node.data.childrenIds) {
			node.data.childrenIds.forEach((childId: string, i: number) => {
				traverse({ id: childId, parentId: id, index: i });
			});
		}

		if (node.type === 'Container' && node.data.props?.childrenIds) {
			node.data.props.childrenIds.forEach(
				(childId: string, i: number) => {
					traverse({ id: childId, parentId: id, index: i });
				}
			);
		}

		if (node.type === 'ColumnsContainer' && node.data.props?.columns) {
			node.data.props.columns.forEach((column: any, colIdx: number) => {
				if (column.childrenIds) {
					column.childrenIds.forEach((childId: string, i: number) => {
						traverse({
							id: childId,
							parentId: id,
							index: i,
							columnIndex: colIdx,
						});
					});
				}
			});
		}
	}

	traverse({ id: 'root', parentId: null });

	return result;
};

export default function EmailLayoutEditor(props: EmailLayoutProps) {
	const childrenIds = props.childrenIds ?? [];
	const document = useDocument();
	const currentBlockId = useCurrentBlockId();

	const flattenedDocument = getFlattenedDocument(document);

	const { activeId, dragOverId } = useDnd({ flattenedDocument });

	useEffect(() => {
		setActiveId(activeId);
		setDragOverId(dragOverId);
	}, [activeId, dragOverId]);

	return (
		<>
			<div
				onClick={() => {
					setSelectedBlockId(null);
				}}
				style={{
					backgroundColor: props.backdropColor ?? '#F5F5F5',
					color: props.textColor ?? '#262626',
					fontFamily:
						FONT_FAMILY_MAPPING[props.fontFamily || 'MODERN_SANS'],
					fontSize: '16px',
					fontWeight: '400',
					letterSpacing: '0.15008px',
					lineHeight: '1.5',
					margin: '0',
					padding: '32px 0',
					width: '100%',
					minHeight: '100%',
				}}
			>
				<table
					align="center"
					width="100%"
					style={{
						margin: '0 auto',
						maxWidth: '600px',
						backgroundColor: props.canvasColor ?? '#FFFFFF',
						borderRadius: props.borderRadius ?? undefined,
						border: (() => {
							const v = props.borderColor;
							if (!v) {
								return undefined;
							}
							return `1px solid ${v}`;
						})(),
					}}
					role="presentation"
					cellSpacing="0"
					cellPadding="0"
					border={0}
				>
					<tbody>
						<tr style={{ width: '100%' }}>
							<td
								style={{
									width: '100%',
									wordBreak: 'break-word',
								}}
							>
								<EditorChildrenIds
									childrenIds={childrenIds}
									onChange={({
										block,
										blockId,
										childrenIds,
									}) => {
										setDocument({
											[blockId]: block,
											[currentBlockId]: {
												type: 'EmailLayout',
												data: {
													...document[currentBlockId]
														.data,
													childrenIds: childrenIds,
												},
											},
										});
										setSelectedBlockId(blockId);
									}}
									blockId={currentBlockId}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{createPortal(
				<DragOverlay style={{ transformOrigin: '0 0', zIndex: 1300 }}>
					{(() => {
						if (!activeId) return null;
						return (
							<>
								{activeId?.toString().startsWith('block-') ? (
									<div
										style={{
											opacity: 0.8,
											width: '100%',
										}}
									>
										<EditorBlock id={activeId.toString()} />
									</div>
								) : null}

								{activeId
									?.toString()
									.startsWith('inspect-block-') ? (
									<BlockButtonOverlay
										label={activeId?.toString() ?? ''}
									/>
								) : null}
							</>
						);
					})()}
				</DragOverlay>,
				window.document.body
			)}
		</>
	);
}
