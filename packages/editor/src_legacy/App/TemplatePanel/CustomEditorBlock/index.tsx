import isEmpty from 'lodash/isEmpty';
import ODSIcon from 'oute-ds-icon';
import ODSTextField from 'oute-ds-text-field';

import { Box, keyframes, SxProps } from '@mui/material';

import EditorBlock from '../../../documents/editor/EditorBlock';

import styles from './styles.module.scss';
import useTemplate from './useTemplate';
// linear-gradient(90deg, #6200EE, #EC3957)

const gradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

function CustomEditorBlock({ mainBoxSx }: { mainBoxSx: SxProps }) {
	const {
		loading: templateLoading,
		prompt,
		setPrompt,
		onSubmitHandler,
	} = useTemplate();

	return (
		<div className={styles.container} data-testid="editor-tab-content">
			<div className={styles.editor_container}>
				<Box sx={mainBoxSx} data-testid="editor-container">
					<EditorBlock id="root" />
				</Box>
			</div>

			<div className={styles.text_field_container}>
				<ODSTextField
					data-testid="prompt-field-container"
					placeholder="Describe your email template or enter a prompt for AI to generate..."
					className="black"
					fullWidth
					multiline={true}
					rows={4}
					onEnter={(e) => {
						if (!e.shiftKey) {
							e.target.blur();
							onSubmitHandler();
						}
					}}
					sx={{
						'.MuiInputBase-root': {
							background: '#fff',
							borderRadius: '8px',
							border: '2px solid transparent',
							backgroundImage:
								'linear-gradient(white, white), linear-gradient(90deg, #8a2be2, #ff1493, #4158D0, #C850C0)',
							backgroundOrigin: 'border-box',
							backgroundClip: 'padding-box, border-box',
							backgroundSize: '400% 400%',
							animation: `${gradientAnimation} 5s ease infinite`,
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

							'& fieldset': {
								border: 'none',
							},
						},
					}}
					onChange={(e) => setPrompt(e.target.value)}
					InputProps={{
						inputProps: {
							'data-testid': 'prompt-text-field',
						},
						endAdornment: (
							<ODSIcon
								outeIconName="SendIcon"
								outeIconProps={{
									sx: {
										color: '#333',
										cursor: 'pointer',
										pointerEvents: 'auto !important',
									},
								}}
								buttonProps={{
									disabled:
										templateLoading || isEmpty(prompt),
									sx: {
										alignSelf: 'flex-end',
										cursor: 'pointer !important',
										pointerEvents: 'auto !important',
										borderRadius: '0.375rem',
										padding: '0.25rem',
										transition:
											'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

										'&:hover:not(:disabled)': {
											transform: 'scale(1.1)',
											backgroundColor:
												'rgba(33, 33, 33, 0.1)',
										},

										'&:hover:disabled': {
											cursor: 'not-allowed !important',
										},
									},
									'data-testid': 'prompt-submit-icon',
								}}
								onClick={() => {
									onSubmitHandler();
								}}
							/>
						),
					}}
				/>
			</div>
		</div>
	);
}

export default CustomEditorBlock;
