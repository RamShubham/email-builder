import { FORMAT_TEXT_COMMAND } from 'lexical';
  import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

  import { TOGGLE_LINK_COMMAND } from '@lexical/link';
  import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
  import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';

  import { formatParagraph } from '../../../node/CustomParagraphNode';
  import { LinkClickData } from '../LinkClick';
  import useLinkClickHandler from '../LinkClick/useLinkClickHandler';

  import useFloatingMenu from './hooks/useFloatingMenu';
  import LinkPopover from './LinkPopover';
  import styles from './styles.module.scss';

  const getIconClass = (isActive: boolean) =>
    isActive ? 'text-blue-500' : 'text-black';

  function FloatingMenu({ editor, coords }, ref) {
    const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
    const [linkNodeRef, setLinkNodeRef] = useState<HTMLElement | null>(null);
    const floatingMenuRef = useRef<HTMLDivElement>(null);

    const { state, isLink, currentLinkUrl, setCurrentLinkUrl } = useFloatingMenu({ editor });

    const insertLinkHandler = () => {
      if (!isLink) {
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
        setLinkNodeRef(data.domElement);
        setCurrentLinkUrl(data.url);
      },
      [setCurrentLinkUrl]
    );

    useLinkClickHandler({ onLinkClick: handleLinkClick });
    useImperativeHandle(ref, () => floatingMenuRef.current, []);

    const preventFocusLoss = (e: React.MouseEvent) => e.preventDefault();
    const btnClass = "p-1 rounded hover:bg-gray-200 flex items-center justify-center cursor-pointer";

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
          <button
            className={btnClass}
            data-testid="floating-text-format-bold"
            aria-label="Format text as bold"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          >
            <Bold className={`w-5 h-5 ${getIconClass(state.isBold)}`} />
          </button>

          <button
            className={btnClass}
            data-testid="floating-text-format-italic"
            aria-label="Format text as italics"
            onMouseDown={preventFocusLoss}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          >
            <Italic className={`w-5 h-5 ${getIconClass(state.isItalic)}`} />
          </button>

          <div className={styles.divider} />

          <button className={btnClass} onMouseDown={preventFocusLoss} onClick={handleUnorderedListClick}>
            <List className={`w-5 h-5 ${getIconClass(state.isUnorderedList)}`} />
          </button>

          <button className={btnClass} onMouseDown={preventFocusLoss} onClick={handleOrderedListClick}>
            <ListOrdered className={`w-5 h-5 ${getIconClass(state.isOrderedList)}`} />
          </button>

          <div className={styles.divider} />

          <button
            className={btnClass}
            ref={setLinkNodeRef}
            data-testid="floating-menu-link-button"
            onMouseDown={preventFocusLoss}
            onClick={insertLinkHandler}
          >
            <Link className={`w-5 h-5 ${getIconClass(isLink || linkPopoverOpen)}`} />
          </button>
        </div>

        {linkPopoverOpen && (
          <LinkPopover
            editor={editor}
            isLink={isLink}
            url={currentLinkUrl}
            setUrl={setCurrentLinkUrl}
            anchorEl={linkNodeRef}
            setLinkPopoverOpen={setLinkPopoverOpen}
          />
        )}
      </>
    );
  }

  export default forwardRef(FloatingMenu);
  