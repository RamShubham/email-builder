import React, { useEffect, useRef, useState } from 'react';

import { Box, TextField } from '@mui/material';
import { Text } from '@usewaypoint/block-text';

import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
	setDocument,
	useDocument,
	useVariables,
} from '../../../editor/EditorContext';

export default function EditableText(props: any) {
	const { isEditing, onEditComplete, ...textProps } = props;

	const { style } = props;
	const { padding, borderRadius, ...rest } = style;
	const fontSize = style?.fontSize ?? 16;

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
		// Save on Enter (unless Shift is pressed for new line)
		// if (e.key === 'Enter' && !e.shiftKey) {
		//   e.preventDefault();
		//   inputRef.current?.blur();
		// }

		if (e.key === 'Enter' && !props.props?.markdown) {
			e.preventDefault();
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

	// useEffect(() => {
	// 	if (!props?.props?.markdown) {
	// 		setEditedText((prevText) => prevText.replace(/\n/g, ' '));
	// 	}
	// }, [props?.props?.markdown]);

	if (isEditing) {
		return (
			<Box>
				<TextField
					inputRef={inputRef}
					fullWidth
					multiline={true}
					variant="outlined"
					value={editedText}
					onChange={handleTextChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					autoFocus
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
							...(props.props?.markdown
								? { margin: '16px 0' }
								: {}),
							fontFamily:
								FONT_FAMILY_MAPPING[style?.fontFamily] ||
								'inherit',
						},

						textarea: {
							padding: 0,
							fontSize: `${fontSize}px`,
							...(props.props?.markdown
								? { lineHeight: `${fontSize * 1.5}px` }
								: { lineHeight: 1.5 }),
							textAlign: style?.textAlign || 'left',
						},

						input: {
							padding: 0,
							fontSize: `${fontSize}px`,
							textAlign: style?.textAlign || 'left',
						},
					}}
					InputProps={{
						inputProps: {
							'data-testid': 'editable-text-input',
						},
					}}
				/>
			</Box>
		);
	}

	return <Text {...textProps} />;
}
