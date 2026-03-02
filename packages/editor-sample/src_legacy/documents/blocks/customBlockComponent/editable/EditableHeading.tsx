import React, { useEffect, useRef, useState } from 'react';

import { Box, TextField } from '@mui/material';
import { Heading } from '@usewaypoint/block-heading';

import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
	setDocument,
	useDocument,
	useVariables,
} from '../../../editor/EditorContext';

const fontSize = {
	h1: '32px',
	h2: '24px',
	h3: '20px',
};

function EditableHeading(props: any) {
	const { isEditing, onEditComplete, ...headingProps } = props;
	const { style } = props;
	const { padding, borderRadius, ...rest } = style;

	const [editedText, setEditedText] = useState(
		props.template?.text || props.props?.text || ''
	);

	const blockId = useCurrentBlockId();
	const document = useDocument();

	const globalVariables = useVariables();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedText(e.target.value);
	};

	const handleBlur = () => {
		// Save changes to document
		if (blockId && document[blockId]) {
			const block = document[blockId];

			setDocument({
				[blockId]: {
					...block,
					data: {
						...block.data,
						props: replaceTemplateVariables(
							{ ...block.data.props, text: editedText },
							globalVariables
						),
						template: {
							...block.data.template,
							text: editedText,
						},
					},
				},
			});
		}

		if (onEditComplete) {
			onEditComplete();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Save on Enter
		if (e.key === 'Enter') {
			e.preventDefault();
			inputRef.current?.blur();
		}

		// Cancel on Escape
		if (e.key === 'Escape') {
			setEditedText(props.props?.text || '');
			if (onEditComplete) {
				onEditComplete();
			}
		}
	};

	// Initialize text when props change
	useEffect(() => {
		setEditedText(props.template?.text || '');
	}, [props.template?.text]);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			const length = inputRef.current.value.length;
			inputRef.current.setSelectionRange(length, length);
		}
	}, [isEditing]);

	if (isEditing) {
		return (
			<Box>
				<TextField
					inputRef={inputRef}
					fullWidth
					variant="outlined"
					value={editedText}
					onChange={handleTextChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					autoFocus
					multiline={true}
					sx={{
						'.MuiOutlinedInput-notchedOutline': { border: 'none' },

						'& .MuiOutlinedInput-root': {
							fontWeight: 'bold',
							...rest,
							borderRadius: borderRadius
								? `${borderRadius}px`
								: undefined,
							paddingTop: `${padding.top}px`,
							paddingBottom: `${padding.bottom}px`,
							paddingLeft: `${padding.left}px`,
							paddingRight: `${padding.right}px`,
							fontFamily:
								FONT_FAMILY_MAPPING[style?.fontFamily] ||
								'inherit',
							fontSize: fontSize[props.props.level] || '24px',
						},

						input: {
							padding: 0,
							fontSize: fontSize[props.props.level] || '24px',
							textAlign: style?.textAlign || 'left',
						},
						textarea: {
							padding: 0,
							textAlign: style?.textAlign || 'left',
							fontSize: 'unset',
						},
					}}
					InputProps={{
						inputProps: {
							'data-testid': 'editable-heading-input',
						},
					}}
				/>
			</Box>
		);
	}

	return <Heading {...headingProps} />;
}

export default EditableHeading;
