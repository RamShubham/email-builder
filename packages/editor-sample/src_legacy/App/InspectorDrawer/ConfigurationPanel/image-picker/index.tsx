import ODSButton from 'oute-ds-button';
import ODSDialog from 'oute-ds-dialog';
import ODSIcon from 'oute-ds-icon';
import { useState } from 'react';

import { ImagePicker } from '@oute/oute-ds.atom.image-picker';

import { useIds } from '../../../../documents/editor/EditorContext';

function ImagePickerPanel({ onChange }) {
	const [isOpen, setIsOpen] = useState(false);

	const { workspaceId } = useIds();

	const onClose = () => setIsOpen(false);

	return (
		<>
			<ODSButton
				variant="black"
				onClick={() => setIsOpen(true)}
				data-testid="inspect-panel-image-picker-button"
			>
				<ODSIcon
					outeIconName="OUTEUploadIcon"
					outeIconProps={{
						sx: {
							color: '#fff',
						},
					}}
				/>
				Upload Image
			</ODSButton>

			<ODSDialog
				open={isOpen}
				dialogWidth="650px"
				dialogHeight="750px"
				onClose={onClose}
				draggable={false}
				hideBackdrop={false}
				showFullscreenIcon={false}
				dialogTitle="Upload Image"
				data-testid="inspect-panel-image-picker-dialog"
				removeContentPadding={true}
				dialogContent={
					<ImagePicker
						onChange={(value: any) => {
							onChange(value.url);
							onClose();
						}}
						hideEditButton={true}
						workspaceId={workspaceId ?? ''}
					/>
				}
			/>
		</>
	);
}

export default ImagePickerPanel;
