import ODSButton from 'oute-ds-button';
import ODSIcon from 'oute-ds-icon';
import ODSLabel from 'oute-ds-label';
import { serverConfig } from 'oute-ds-utils';
import { useState } from 'react';

import { Box } from '@mui/material';

import TinyEmailIcon from '../../assets/tinyEmail.svg';

import RenameModal from './RenameModal';
import useNavbar from './useNavbar';

function Navbar() {
	const [open, setOpen] = useState(false);

	const { loading, onSaveHandler, templateName, show } = useNavbar();

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					padding: '12px',
					borderBottom: '1px solid #e0e0e0',
					backgroundColor: '#ffffff',
					height: '60px',
					justifyContent: 'space-between',
					gap: '20rem',
				}}
				data-testid="navbar"
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<ODSIcon
						imageProps={{
							src: TinyEmailIcon,
							width: '28px',
							height: '28px',
						}}
						onClick={() => {
							window.location.href = serverConfig.WC_LANDING_URL;
						}}
						buttonProps={{
							'data-testid': 'email-logo',
						}}
					/>

					{/* <ODSTextField
					hideBorders
					value={templateName}
					size="50px"
					onChange={(e) => setTemplateName(e.target.value)}
					sx={{
						'& .MuiInputBase-input': {
							fontWeight: '500',
							fontSize: '1.125rem',
						},
					}}
					InputProps={{
						inputProps: {
							'data-testid': 'template-name-field',
						},
					}}
				/> */}

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							cursor: 'pointer',
						}}
						onClick={() => setOpen(true)}
						data-testid="template-name-container"
					>
						<ODSLabel
							variant="body1"
							sx={{
								fontWeight: 600,
								maxWidth: '16rem',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
							data-testid="email-template-name"
						>
							{templateName || `Untitled Template`}
						</ODSLabel>

						<ODSIcon
							outeIconName="OUTEEditIcon"
							outeIconProps={{
								'data-testid': 'template-name-edit-icon',
								sx: {
									width: '1.25rem',
									height: '1.25rem',
								},
							}}
						/>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', gap: 1.5 }}>
					<ODSIcon
						outeIconName="OUTESupportAgentIcon"
						outeIconProps={{
							sx: {
								width: '2rem',
								height: '2rem',
								color: '#212121',
							},
						}}
						buttonProps={{
							sx: {
								padding: 0,
							},
						}}
						onClick={() => {
							show();
						}}
					/>

					<ODSButton
						variant="contained"
						size="large"
						startIcon={
							<ODSIcon
								outeIconName="OUTESaveIcon"
								outeIconProps={{
									sx: {
										color: '#fff',
									},
								}}
							/>
						}
						sx={{
							backgroundColor: '#1a1a1a',
							'&:hover': {
								backgroundColor: '#333333',
							},
						}}
						onClick={onSaveHandler}
						disabled={loading}
						data-testid="save-button"
					>
						SAVE
					</ODSButton>
				</Box>
			</Box>

			<RenameModal
				open={open}
				loading={loading}
				onSave={onSaveHandler}
				onClose={() => setOpen(false)}
				initialTemplateName={templateName}
			/>
		</>
	);
}

export default Navbar;
