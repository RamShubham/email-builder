import { $getSelection, $isRangeSelection } from 'lexical';
import ODSIcon from 'oute-ds-icon';
import ODSPopover from 'oute-ds-popover';
import ODSTextField from 'oute-ds-text-field';
import React, { useEffect, useState } from 'react';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';

import styles from './styles.module.scss';

const validateUrl = (urlString: string): boolean => {
	if (!urlString || urlString === 'https://') return false;

	try {
		new URL(urlString);
		return true;
	} catch {
		return false;
	}
};

const buttonSx = {
	padding: '0.25rem !important',
	'&:hover': {
		backgroundColor: '#eee',
	},
};

const iconSx = {
	width: '1.5rem',
	height: '1.5rem',
	color: '#000000',
};

function LinkPopover({
	editor,
	linkPopoverOpen,
	setLinkPopoverOpen,
	initialUrl,
	anchorEl,
}) {
	const [url, setUrl] = useState(initialUrl);
	const [isValid, setIsValid] = useState(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const handleConfirm = () => {
		if (!validateUrl(url)) {
			setIsValid(false);
			return;
		}

		let finalUrl = url;
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			finalUrl = `https://${url}`;
		}

		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				editor.dispatchCommand(TOGGLE_LINK_COMMAND, finalUrl);
			}
		});
		setLinkPopoverOpen(false);
	};

	useEffect(() => {
		if (linkPopoverOpen) {
			setUrl(initialUrl || 'https://');
			setIsValid(true);
			setIsEditing(!initialUrl);
		}
	}, [initialUrl, linkPopoverOpen]);

	return (
		<ODSPopover
			anchorEl={anchorEl}
			open={linkPopoverOpen}
			onClose={() => setLinkPopoverOpen(false)}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			// disablePortal={true}
		>
			<div className={styles.container}>
				{isEditing ? (
					<>
						<ODSTextField
							value={url}
							className="black"
							onChange={(e) => setUrl(e.target.value)}
							placeholder="Enter URL"
							autoFocus
							onEnter={handleConfirm}
						/>
						<ODSIcon
							outeIconName={'CheckIcon'}
							onClick={handleConfirm}
							outeIconProps={{
								sx: iconSx,
							}}
							buttonProps={{
								'data-testid': 'floating-menu-link-confirm',
								sx: buttonSx,
							}}
						/>
						<ODSIcon
							outeIconName={'OUTECloseIcon'}
							onClick={() => {
								setLinkPopoverOpen(false);
							}}
							outeIconProps={{
								sx: iconSx,
							}}
							buttonProps={{
								'data-testid': 'floating-menu-link-cancel',
								sx: buttonSx,
							}}
						/>
					</>
				) : (
					<>
						{/* <a
							href="https://www.google.com"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								color: 'blue',
								textDecoration: 'underline',
							}}
						>
							asd
						</a> */}

						<span
							className={styles.link}
							onClick={() => {
								window.open(url, '_blank');
							}}
						>
							{url}
						</span>

						<ODSIcon
							outeIconName={'OUTEEditIcon'}
							onClick={() => {
								setIsEditing(true);
							}}
							outeIconProps={{
								sx: iconSx,
							}}
							buttonProps={{
								'data-testid': 'floating-menu-link-edit',
								sx: buttonSx,
							}}
						/>
						<ODSIcon
							outeIconName={'OUTETrashIcon'}
							onClick={() => {
								editor.dispatchCommand(
									TOGGLE_LINK_COMMAND,
									null
								);
								setLinkPopoverOpen(false);
							}}
							outeIconProps={{
								sx: iconSx,
							}}
							buttonProps={{
								'data-testid': 'floating-menu-link-delete',
								sx: buttonSx,
							}}
						/>
					</>
				)}
				{!isValid && <div className={styles.error}>Invalid URL</div>}
			</div>
		</ODSPopover>
	);
}

export default LinkPopover;
