import React, { memo, useEffect, useRef, useState } from 'react';

import { Box, TextField } from '@mui/material';
import { Button } from '@usewaypoint/block-button';

import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
	setDocument,
	useDocument,
	useVariables,
} from '../../../editor/EditorContext';

const paddingMapping = {
	'x-small': '4px 8px',
	small: '8px 12px',
	medium: '12px 20px',
	large: '16px 32px',
};

const buttonStyleMapping = {
	rectangle: '0px',
	rounded: '4px',
	pill: '64px',
};

function EditableButton(props: any) {
	const { isEditing, onEditComplete, ...buttonProps } = props;
	const { style } = props;
	const { padding, ...rest } = style;

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

	if (isEditing) {
		return (
			<Box
				component={'div'}
				sx={{
					display: 'flex',
					justifyContent: style.textAlign,
					paddingTop: `${padding.top}px`,
					paddingBottom: `${padding.bottom}px`,
					paddingLeft: `${padding.left}px`,
					paddingRight: `${padding.right}px`,
					background: style.backgroundColor || 'transparent',
				}}
			>
				<div
					style={{
						borderRadius:
							buttonStyleMapping[
								props.props?.buttonStyle || 'rounded'
							],
						background:
							props.props?.buttonBackgroundColor || '#999',
						width: props.props?.fullWidth ? '100%' : 'fit-content',
						textAlign: style.textAlign,
					}}
				>
					<TextField
						inputRef={inputRef}
						fullWidth
						variant="outlined"
						value={editedText}
						onChange={handleTextChange}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						autoFocus
						inputProps={{
							size: editedText.length,
						}}
						sx={{
							width: 'fit-content',

							'.MuiOutlinedInput-notchedOutline': {
								border: 'none',
							},

							'& .MuiOutlinedInput-root': {
								...rest,
								padding:
									paddingMapping[
										props.props?.size || 'medium'
									],
								color: props.props?.buttonTextColor ?? '#fff',
								fontWeight: style?.fontWeight ?? 'bold',
								fontFamily:
									FONT_FAMILY_MAPPING[style?.fontFamily] ||
									'inherit',

								input: {
									padding: 0,
									fontSize: style?.fontSize
										? `${style.fontSize}px`
										: '16px',
								},
							},
						}}
						InputProps={{
							inputProps: {
								'data-testid': 'editable-button-input',
							},
						}}
					/>
				</div>
			</Box>
		);
	}

	return <Button {...buttonProps} />;
}

export default memo(EditableButton);
