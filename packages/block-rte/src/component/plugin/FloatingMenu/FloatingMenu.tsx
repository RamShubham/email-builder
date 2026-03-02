import { FORMAT_TEXT_COMMAND } from 'lexical';
import ODSIcon from 'oute-ds-icon';
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import { formatParagraph } from '../../../node/CustomParagraphNode';
import { LinkClickData } from '../LinkClick';
import useLinkClickHandler from '../LinkClick/useLinkClickHandler';

import useFloatingMenu from './hooks/useFloatingMenu';
import LinkPopover from './LinkPopover';
import styles from './styles.module.scss';

const buttonSx = {
	padding: '0.25rem !important',
	borderRadius: '0.25rem',
	'&:hover': {
		backgroundColor: '#eee',
	},
};

const getIconSx = (isActive: boolean) => {
	return {
		width: '2rem',
		height: '2rem',
		color: isActive ? '#4694E2' : '#000000',
	};
};

function FloatingMenu({ editor, coords }, ref) {
	const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
	const [linkNodeRef, setLinkNodeRef] = useState<HTMLElement | null>(null);

	const floatingMenuRef = useRef<HTMLDivElement>(null);

	const { state, isLink, currentLinkUrl, setCurrentLinkUrl } =
		useFloatingMenu({ editor });

	const insertLinkHandler = () => {
		if (!isLink) {
			setLinkPopoverOpen(true);
		} else {
			setLinkPopoverOpen(false);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	};

	const handleOrderedListClick = () => {
		if (state.isOrderedList) {
			formatParagraph(editor);
		} else {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		}
	};

	const handleUnorderedListClick = () => {
		if (state.isUnorderedList) {
			formatParagraph(editor);
		} else {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		}
	};

	const handleLinkClick = useCallback(
		(data: LinkClickData) => {
			setLinkPopoverOpen(true);
			setLinkNodeRef(data.domElement);
			setCurrentLinkUrl(data.url);
		},
		[setCurrentLinkUrl]
	);

	useLinkClickHandler({ onLinkClick: handleLinkClick });

	useImperativeHandle(ref, () => floatingMenuRef.current, []);

	return (
		<>
			<div
				className={styles.container}
				ref={floatingMenuRef}
				style={{
					position: 'absolute',
					top: coords?.y,
					left: coords?.x,
					visibility: coords !== undefined ? 'visible' : 'hidden',
					opacity: coords !== undefined ? 1 : 0,
					zIndex: 10000,
				}}
			>
				<ODSIcon
					outeIconName={'OUTEBoldIcon'}
					outeIconProps={{
						sx: getIconSx(state.isBold),
					}}
					onClick={() => {
						editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
					}}
					buttonProps={{
						'data-testid': 'floating-text-format-bold',
						'aria-label': 'Format text as bold',
						sx: buttonSx,
					}}
				/>

				<ODSIcon
					outeIconName={'OUTEItalicIcon'}
					outeIconProps={{
						sx: getIconSx(state.isItalic),
					}}
					onClick={() => {
						editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
					}}
					buttonProps={{
						'data-testid': 'floating-text-format-italic',
						'aria-label': 'Format text as italics',
						sx: buttonSx,
					}}
				/>

				<div className={styles.divider} />

				<button
					onClick={handleUnorderedListClick}
					className={styles.button}
				>
					<FormatListBulletedIcon
						sx={getIconSx(state.isUnorderedList)}
					/>
				</button>

				<button
					onClick={handleOrderedListClick}
					className={styles.button}
				>
					<FormatListNumberedIcon
						sx={getIconSx(state.isOrderedList)}
					/>
				</button>

				<div className={styles.divider} />

				<ODSIcon
					outeIconName={'OUTEInsertLinkIcon'}
					outeIconProps={{
						sx: getIconSx(isLink),
					}}
					onClick={insertLinkHandler}
					buttonProps={{
						'data-testid': 'floating-text-insert-link',
						'aria-label': 'Insert link',
						sx: buttonSx,
					}}
				/>
			</div>

			<LinkPopover
				editor={editor}
				linkPopoverOpen={linkPopoverOpen}
				setLinkPopoverOpen={setLinkPopoverOpen}
				initialUrl={currentLinkUrl}
				anchorEl={coords ? floatingMenuRef.current : linkNodeRef}
			/>
		</>
	);
}

export default forwardRef(FloatingMenu);
