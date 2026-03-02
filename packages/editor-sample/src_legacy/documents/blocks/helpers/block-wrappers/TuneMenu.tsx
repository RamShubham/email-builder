import cloneDeep from 'lodash/cloneDeep';
import React from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { IconButton, Paper, Stack, SxProps, Tooltip } from '@mui/material';

import generateId from '../../../../utils/generateId';
import { TEditorBlock } from '../../../editor/core';
import {
	resetDocument,
	setSelectedBlockId,
	useDocument,
} from '../../../editor/EditorContext';
import { ColumnsContainerProps } from '../../ColumnsContainer/ColumnsContainerPropsSchema';

const sx: SxProps = {
	position: 'absolute',
	top: 0,
	left: -56,
	borderRadius: 64,
	paddingX: 0.5,
	paddingY: 1,
	zIndex: 'fab',
};

type Props = {
	blockId: string;
};
export default function TuneMenu({ blockId }: Props) {
	const document = useDocument();

	const handleDeleteClick = () => {
		const filterChildrenIds = (
			childrenIds: string[] | null | undefined
		) => {
			if (!childrenIds) {
				return childrenIds;
			}
			return childrenIds.filter((f) => f !== blockId);
		};

		const nDocument: typeof document = { ...document };

		for (const [id, b] of Object.entries(nDocument)) {
			const block = b as TEditorBlock;
			if (id === blockId) {
				continue;
			}
			switch (block.type) {
				case 'EmailLayout':
					nDocument[id] = {
						...block,
						data: {
							...block.data,
							childrenIds: filterChildrenIds(
								block.data.childrenIds
							),
						},
					};
					break;
				case 'Container':
					nDocument[id] = {
						...block,
						data: {
							...block.data,
							props: {
								...block.data.props,
								childrenIds: filterChildrenIds(
									block.data.props?.childrenIds
								),
							},
						},
					};
					break;
				case 'ColumnsContainer':
					nDocument[id] = {
						type: 'ColumnsContainer',
						data: {
							style: block.data.style,
							props: {
								...block.data.props,
								columns: block.data.props?.columns?.map(
									(c) => ({
										childrenIds: filterChildrenIds(
											c.childrenIds
										),
									})
								),
							},
						} as ColumnsContainerProps,
					};
					break;
				default:
					nDocument[id] = block;
			}
		}
		delete nDocument[blockId];
		resetDocument(nDocument);
	};

	const handleDuplicateClick = () => {
		const nDocument: typeof document = cloneDeep(document);

		const currBlock = cloneDeep(nDocument[blockId]);
		const newBlockId = generateId();

		if (currBlock.type === 'ColumnsContainer') {
			const { props } = currBlock.data;
			const { columns } = props;

			const newColumns = columns.map((column, i: number) => {
				const newChildrenIds = column.childrenIds.map((childId) => {
					const existingChildBlock = nDocument[childId];

					const newId = `${generateId()}-${i}`;

					nDocument[newId] = cloneDeep(existingChildBlock);
					return newId;
				});

				return {
					childrenIds: newChildrenIds,
				};
			});

			props.columns = newColumns;
			currBlock.data.props = props;
		}

		if (currBlock.type === 'Container') {
			const { props } = currBlock.data;
			const { childrenIds } = props;

			const newChildrenIds = childrenIds.map((childId, i: number) => {
				const existingChildBlock = nDocument[childId];
				const newId = `${generateId()}-${i}`;
				nDocument[newId] = cloneDeep(existingChildBlock);
				return newId;
			});
			props.childrenIds = newChildrenIds;
			currBlock.data.props = props;
		}

		nDocument[newBlockId] = {
			...currBlock,
		};

		const { data } = nDocument.root;
		const childrenIds = data.childrenIds;

		const currBlockIndex = childrenIds.indexOf(blockId);

		// TODO: also check in childrenIds of container and columns container if the blockId is present or not if it is not present in root childrenId
		//  duplicate block is not working for container and columns container
		if (currBlockIndex === -1) {
			return;
		}

		childrenIds.splice(currBlockIndex + 1, 0, newBlockId);

		nDocument.root.data.childrenIds = childrenIds;

		resetDocument(nDocument);
		setSelectedBlockId(newBlockId);
	};

	return (
		<Paper
			sx={{ ...sx, backgroundColor: '#2196F3' }}
			onClick={(ev) => ev.stopPropagation()}
			data-testid="tune-menu"
		>
			<Stack>
				{/* <Tooltip title="Move up" placement="left-start">
          <IconButton onClick={() => handleMoveClick('up')} sx={{ color: '#fff' }}>
            <ArrowUpwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Move down" placement="left-start">
          <IconButton onClick={() => handleMoveClick('down')} sx={{ color: '#fff' }}>
            <ArrowDownwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip> */}

				<Tooltip title="Duplicate" placement="left-start">
					<IconButton
						onClick={handleDuplicateClick}
						sx={{ color: '#fff' }}
						data-testid="duplicate-button"
					>
						<ContentCopyIcon fontSize="small" />
					</IconButton>
				</Tooltip>

				<Tooltip title="Delete" placement="left-start">
					<IconButton
						onClick={handleDeleteClick}
						sx={{ color: '#fff' }}
						data-testid="delete-button"
					>
						<DeleteOutlined fontSize="medium" />
					</IconButton>
				</Tooltip>
			</Stack>
		</Paper>
	);
}
