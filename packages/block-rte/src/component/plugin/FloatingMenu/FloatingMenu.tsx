import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';

import { formatParagraph } from '../../../node/CustomParagraphNode';
import { LinkClickData } from '../LinkClick';
import useLinkClickHandler from '../LinkClick/useLinkClickHandler';

import useFloatingMenu from './hooks/useFloatingMenu';
import LinkPopover from './LinkPopover';

type FloatingMenuCoords = { x: number; y: number } | undefined;

interface FloatingMenuProps {
	editor: LexicalEditor;
	coords: FloatingMenuCoords;
}

const preventFocusLoss = (e: React.MouseEvent) => {
	e.preventDefault();
	e.stopPropagation();
};

function FloatingMenu({ editor, coords }: FloatingMenuProps, ref: React.Ref<HTMLDivElement | null>) {
	const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
	const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
	const floatingMenuRef = useRef<HTMLDivElement>(null);
	const linkBtnRef = useRef<HTMLButtonElement>(null);

	const { state, isLink, currentLinkUrl, setCurrentLinkUrl } = useFloatingMenu({ editor });

	const insertLinkHandler = () => {
		if (!isLink) {
			setLinkAnchorEl(linkBtnRef.current);
			setLinkPopoverOpen(true);
		} else {
			setLinkPopoverOpen(false);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	};

	const handleOrderedListClick = () => {
		if (state.isOrderedList) formatParagraph(editor);
		else editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
	};

	const handleUnorderedListClick = () => {
		if (state.isUnorderedList) formatParagraph(editor);
		else editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
	};

	const handleLinkClick = useCallback(
		(data: LinkClickData) => {
			setLinkPopoverOpen(true);
			setLinkAnchorEl(data.domElement);
			setCurrentLinkUrl(data.url);
		},
		[setCurrentLinkUrl]
	);

	useLinkClickHandler({ onLinkClick: handleLinkClick });
	useImperativeHandle(ref, () => floatingMenuRef.current, []);

	const isVisible = coords !== undefined;

	return (
		<>
			<div
				ref={floatingMenuRef}
				onMouseDown={preventFocusLoss}
				style={{
					position: 'absolute',
					top: coords?.y,
					left: coords?.x,
					visibility: isVisible ? 'visible' : 'hidden',
					opacity: isVisible ? 1 : 0,
					zIndex: 10000,
					display: 'flex',
					alignItems: 'center',
					gap: '2px',
					padding: '4px',
					background: 'white',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
					border: '1px solid #e5e7eb',
				}}
			>
				<ToolbarButton
					active={state.isBold}
					onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
					aria-label="Bold"
					data-testid="floating-text-format-bold"
				>
					<Bold className="w-4 h-4" />
				</ToolbarButton>

				<ToolbarButton
					active={state.isItalic}
					onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
					aria-label="Italic"
					data-testid="floating-text-format-italic"
				>
					<Italic className="w-4 h-4" />
				</ToolbarButton>

				<Divider />

				<ToolbarButton
					active={state.isUnorderedList}
					onClick={handleUnorderedListClick}
					aria-label="Bullet list"
				>
					<List className="w-4 h-4" />
				</ToolbarButton>

				<ToolbarButton
					active={state.isOrderedList}
					onClick={handleOrderedListClick}
					aria-label="Numbered list"
				>
					<ListOrdered className="w-4 h-4" />
				</ToolbarButton>

				<Divider />

				<ToolbarButton
					ref={linkBtnRef}
					active={isLink || linkPopoverOpen}
					onClick={insertLinkHandler}
					aria-label="Link"
					data-testid="floating-menu-link-button"
				>
					<Link className="w-4 h-4" />
				</ToolbarButton>
			</div>

			{linkPopoverOpen && (
				<LinkPopover
					editor={editor}
					isLink={isLink}
					url={currentLinkUrl}
					setUrl={setCurrentLinkUrl}
					anchorEl={linkAnchorEl}
					onClose={() => setLinkPopoverOpen(false)}
				/>
			)}
		</>
	);
}

const ToolbarButton = forwardRef<HTMLButtonElement, {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
	'aria-label'?: string;
	'data-testid'?: string;
}>(({ active, onClick, children, ...rest }, ref) => (
	<button
		ref={ref}
		type="button"
		onMouseDown={preventFocusLoss}
		onClick={onClick}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 28,
			height: 28,
			border: 'none',
			borderRadius: 6,
			cursor: 'pointer',
			background: active ? '#e0e7ff' : 'transparent',
			color: active ? '#4338ca' : '#374151',
		}}
		{...rest}
	>
		{children}
	</button>
));

function Divider() {
	return <div style={{ width: 1, height: 20, backgroundColor: '#e5e7eb', margin: '0 2px' }} />;
}

export default forwardRef(FloatingMenu);
