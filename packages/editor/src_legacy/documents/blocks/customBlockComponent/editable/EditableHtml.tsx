import React, { memo, useEffect, useRef, useState } from 'react';

import { Box, TextField } from '@mui/material';
import { Html } from '@usewaypoint/block-html';

import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
	setDocument,
	useDocument,
	useVariables,
} from '../../../editor/EditorContext';

function EditableHtml(props: any) {
	const { isEditing, onEditComplete, ...htmlProps } = props;
	const [editedHtml, setEditedHtml] = useState(
		props.template?.contents || props.props?.contents || ''
	);

	const blockId = useCurrentBlockId();
	const document = useDocument();
	const globalVariables = useVariables();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleHtmlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedHtml(e.target.value);
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
							{ ...block.data.props, contents: editedHtml },
							globalVariables
						),
						template: {
							...block.data.template,
							contents: editedHtml,
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
		// Save on Ctrl+Enter or Cmd+Enter
		console.log('e >>', e);
		if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
			e.preventDefault();
			inputRef.current?.blur();
		}

		// Cancel on Escape
		if (e.key === 'Escape') {
			setEditedHtml(props.props?.html || '');
			if (onEditComplete) {
				onEditComplete();
			}
		}
	};

	// Initialize html when props change
	useEffect(() => {
		setEditedHtml(props.template?.contents || '');
	}, [props.template?.contents]);

	if (isEditing) {
		return (
			<Box>
				<TextField
					inputRef={inputRef}
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					value={editedHtml}
					onChange={handleHtmlChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					autoFocus
					sx={{
						'& .MuiOutlinedInput-root': {
							fontFamily: 'monospace',
						},
					}}
					InputProps={{
						inputProps: {
							'data-testid': 'editable-html-input',
						},
					}}
				/>
			</Box>
		);
	}

	return <Html {...htmlProps} />;
}

export default memo(EditableHtml);
