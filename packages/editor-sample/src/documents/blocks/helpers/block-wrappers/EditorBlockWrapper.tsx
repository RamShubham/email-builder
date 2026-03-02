import React, { CSSProperties, useState } from 'react';

import { Box } from '@mui/material';

import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
	setSelectedBlockId,
	useSelectedBlockId,
} from '../../../editor/EditorContext';

import TuneMenu from './TuneMenu';

type TEditorBlockWrapperProps = {
	children: JSX.Element;
};

export default function EditorBlockWrapper({
	children,
}: TEditorBlockWrapperProps) {
	const [isEditing, setIsEditing] = useState(false);
	const selectedBlockId = useSelectedBlockId();
	// const [mouseInside, setMouseInside] = useState(false);
	const blockId = useCurrentBlockId();

	let outline: CSSProperties['outline'];
	if (selectedBlockId === blockId) {
		outline = '2px solid #2196F3';
	}
	// else if (mouseInside) {
	//   outline = '2px solid rgba(0,121,204, 0.3)';
	// }

	const renderMenu = () => {
		if (selectedBlockId !== blockId) {
			return null;
		}
		return <TuneMenu blockId={blockId} />;
	};

	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {
				isEditing,
				onEditComplete: () => setIsEditing(false),
			} as any);
		}
		return child;
	});

	return (
		<Box
			sx={{
				position: 'relative',
				maxWidth: '100%',
				// outlineOffset: '-1px',
				outline,
			}}
			// onMouseEnter={(ev) => {
			//   setMouseInside(true);
			//   ev.stopPropagation();
			// }}
			// onMouseLeave={() => {
			//   setMouseInside(false);
			// }}
			onClick={(ev) => {
				setSelectedBlockId(blockId);
				setIsEditing(true);
				ev.stopPropagation();
				ev.preventDefault();
			}}
			data-testid={`editor-block-wrapper-${blockId}`}
		>
			{renderMenu()}
			{childrenWithProps}
		</Box>
	);
}
