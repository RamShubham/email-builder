import { showAlert } from 'oute-ds-alert';
import ODSButton from 'oute-ds-button';
import ODSDialog from 'oute-ds-dialog';
import ODSIcon from 'oute-ds-icon';
import ODSTextField from 'oute-ds-text-field';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

type RenameModalProps = {
	open: boolean;
	onClose: () => void;
	initialTemplateName: string;
	onSave: ({ additionalData }: { additionalData: { name: string } }) => void;
	loading: boolean;
};

function RenameModal({
	open,
	onClose,
	initialTemplateName,
	onSave,
	loading = false,
}: RenameModalProps) {
	const [templateName, setTemplateName] = useState(initialTemplateName || '	');

	const onSaveHandler = async () => {
		if (templateName === '') {
			showAlert({
				message: 'Please enter a name for email template.',
				type: 'error',
			});
			return;
		}

		await onSave({ additionalData: { name: templateName } });
		onClose();
	};

	useEffect(() => {
		if (open) {
			setTemplateName(initialTemplateName || '');
		}
	}, [initialTemplateName, open]);

	return (
		<ODSDialog
			open={open}
			onClose={onClose}
			showFullscreenIcon={false}
			draggable={false}
			hideBackdrop={false}
			dialogWidth="35rem"
			data-testid="rename-modal"
			dialogTitle={
				<div className={styles.header}>
					<ODSIcon
						outeIconName="OUTESaveIcon"
						outeIconProps={{
							'data-testid': 'save-icon',
							sx: {
								width: '2rem',
								height: '2rem',
								color: '#212121',
							},
						}}
					/>
					<span>Save Email Template as</span>
				</div>
			}
			dialogContent={
				<div className={styles.content}>
					<ODSTextField
						className="black"
						placeholder="Email Template Name"
						value={templateName}
						fullWidth
						autoFocus
						onChange={(e) => {
							const value = e.target.value;
							setTemplateName(value.slice(0, 75));
						}}
						InputProps={{
							endAdornment: (
								<span data-testid="template-name-character-count">
									{templateName?.length}/75
								</span>
							),
							inputProps: {
								'data-testid': 'template-name-field',
							},
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onSaveHandler();
							}
						}}
					/>
				</div>
			}
			dialogActions={
				<ODSButton
					variant="black"
					onClick={onSaveHandler}
					disabled={loading}
					data-testId="rename-modal-save-button"
				>
					Save Changes
				</ODSButton>
			}
		/>
	);
}

export default RenameModal;
