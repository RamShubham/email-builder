import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import { TEditorBlock } from '../../../../editor/core';
import { useSelectedBlockId } from '../../../../editor/EditorContext';

import BlocksMenu from './BlocksMenu';
import DividerButton from './DividerButton';
import PlaceholderButton from './PlaceholderButton';

type Props = {
        placeholder?: boolean;
        onSelect: (block: TEditorBlock) => void;
        blockIds?: string[];
};
export default function AddBlockButton({
        onSelect,
        placeholder,
        blockIds,
}: Props) {
        const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
        const [buttonElement, setButtonElement] = useState<HTMLElement | null>(
                null
        );
        const selectedBlockId = useSelectedBlockId();

        const handleButtonClick = () => {
                setMenuAnchorEl(buttonElement);
        };

        const renderButton = () => {
                if (placeholder) {
                        return <PlaceholderButton onClick={handleButtonClick} />;
                }

                if (blockIds?.includes(selectedBlockId ?? '')) {
                        return <DividerButton onClick={handleButtonClick} />;
                }
                return null;
        };

        return (
                <>
                        <div
                                ref={setButtonElement}
                                style={{
                                        position: 'relative',
                                        // zIndex: 2 // commented zIndex because it was overlapping with tuneMenu inside columns container
                                }}
                        >
                                {renderButton()}
                        </div>
                        {createPortal(
                                <BlocksMenu
                                        anchorEl={menuAnchorEl}
                                        setAnchorEl={setMenuAnchorEl}
                                        onSelect={onSelect}
                                />,
                                document.body
                        )}
                </>
        );
}
