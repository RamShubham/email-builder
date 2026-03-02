import ODSButton from 'oute-ds-button';
import React, { useState } from 'react';

import {
	Alert,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Link,
	TextField,
	Typography,
} from '@mui/material';

import {
	resetDocument,
	resetVariables,
} from '../../../documents/editor/EditorContext';
import getGlobalVariables from '../../../utils/getGlobalVariables';

import validateJsonStringValue from './validateJsonStringValue';

type ImportJsonDialogProps = {
	onClose: () => void;
};

export default function ImportJsonDialog({ onClose }: ImportJsonDialogProps) {
	const [value, setValue] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleChange: React.ChangeEventHandler<
		HTMLTextAreaElement | HTMLInputElement
	> = (ev) => {
		const v = ev.currentTarget.value;
		setValue(v);
		const { error } = validateJsonStringValue(v);
		setError(error ?? null);
	};

	return (
		<Dialog
			open
			onClose={onClose}
			PaperProps={{
				'data-testid': 'import-json-dialog',
			}}
			sx={{
				'& .MuiBackdrop-root': {
					backgroundColor: 'rgba(0, 0, 0, 0.1)',
					backdropFilter: 'blur(4px)',
				},
			}}
		>
			<DialogTitle>Import JSON</DialogTitle>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					const { error, data } = validateJsonStringValue(value);
					setError(error ?? null);
					if (!data) {
						return;
					}
					const globalVariables = getGlobalVariables({
						document: data,
					});

					resetDocument(data);
					resetVariables(globalVariables);
					onClose();
				}}
			>
				<DialogContent>
					<Typography
						color="text.secondary"
						paragraph
						data-testid="import-json-label"
					>
						Copy and paste an EmailBuilder.js JSON (
						<Link
							href="https://gist.githubusercontent.com/jordanisip/efb61f56ba71bd36d3a9440122cb7f50/raw/30ea74a6ac7e52ebdc309bce07b71a9286ce2526/emailBuilderTemplate.json"
							target="_blank"
							underline="none"
							sx={{
								'&:hover': {
									textDecoration: 'underline',
								},
							}}
						>
							example
						</Link>
						).
					</Typography>

					{error ? (
						<Alert
							data-testid="import-json-error-alert"
							color="error"
							severity="error"
							sx={{
								alignItems: 'center',
								mb: 2,
								transition:
									'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								animation: error
									? 'shake 0.3s ease-in-out'
									: 'none',
								'@keyframes shake': {
									'0%, 100%': {
										transform: 'translateX(0)',
									},
									'20%, 60%': {
										transform: 'translateX(-8px)',
									},
									'40%, 80%': {
										transform: 'translateX(8px)',
									},
								},
							}}
						>
							{error}
						</Alert>
					) : null}

					<TextField
						error={error !== null}
						value={value}
						onChange={handleChange}
						type="text"
						helperText="This will override your current template."
						variant="outlined"
						fullWidth
						rows={10}
						multiline
						sx={{
							transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
							'& .MuiInputBase-root': {
								transition:
									'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:focus-within': {
									transform: 'scale(1.01)',
									boxShadow:
										'0 4px 20px rgba(33, 150, 243, 0.15)',
								},
							},
						}}
						InputProps={{
							inputProps: {
								'data-testid': 'import-json-textfield',
							},
						}}
					/>
				</DialogContent>
				<DialogActions>
					<ODSButton
						variant="black-outlined"
						type="button"
						onClick={onClose}
						data-testid="import-json-cancel-button"
					>
						Cancel
					</ODSButton>

					<ODSButton
						variant="black"
						type="submit"
						disabled={error !== null}
						data-testid="import-json-import-button"
					>
						Import
					</ODSButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
