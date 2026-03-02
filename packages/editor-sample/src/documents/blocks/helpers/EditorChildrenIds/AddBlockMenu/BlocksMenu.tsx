import React from 'react';

  import { Popover, PopoverContent } from '@/components/ui/popover';
  import { BUTTONS } from '../../../../../constant/buttons';
  import { TEditorBlock } from '../../../../editor/core';

  import BlockButton from './BlockButton';

  type BlocksMenuProps = {
    anchorEl: HTMLElement | null;
    setAnchorEl: (v: HTMLElement | null) => void;
    onSelect: (block: TEditorBlock) => void;
  };

  export default function BlocksMenu({ anchorEl, setAnchorEl, onSelect }: BlocksMenuProps) {
    const onClose = () => setAnchorEl(null);
    const onClick = (block: TEditorBlock) => {
      onSelect(block);
      setAnchorEl(null);
    };

    if (anchorEl === null) return null;

    return (
      <Popover open onOpenChange={(open) => { if (!open) onClose(); }}>
        <PopoverContent
          className="p-2 w-auto"
          style={{
            position: 'fixed',
            top: anchorEl.getBoundingClientRect().bottom + 4,
            left: anchorEl.getBoundingClientRect().left,
            zIndex: 9999,
          }}
          onInteractOutside={onClose}
        >
          <div className="grid grid-cols-4 gap-1">
            {BUTTONS.map((k, i) => (
              <BlockButton
                key={i}
                label={k.label}
                icon={k.icon}
                onClick={() => onClick(k.block())}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  