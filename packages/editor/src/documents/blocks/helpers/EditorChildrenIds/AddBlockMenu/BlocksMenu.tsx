import React, { useEffect, useRef, useState } from 'react';

import { BUTTONS } from '../../../../../constant/buttons';
import { TEditorBlock } from '../../../../editor/core';

import BlockButton from './BlockButton';

type BlocksMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (v: HTMLElement | null) => void;
  onSelect: (block: TEditorBlock) => void;
};

const menuWidth = 320;


export default function BlocksMenu({ anchorEl, setAnchorEl, onSelect }: BlocksMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const onClose = () => setAnchorEl(null);

  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    setAnchorEl(null);
  };


  useEffect(() => {
    if (!anchorEl) return;

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight || 160;
      let left = rect.left + rect.width / 2 - menuWidth / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
      let top = rect.bottom + 6;
      if (top + menuHeight > window.innerHeight - 8) {
        top = Math.max(8, rect.top - menuHeight - 6);
      }
      setPosition({ top, left });
    };
    updatePosition();
    requestAnimationFrame(updatePosition);
  }, [anchorEl]);

  useEffect(() => {
    if (!anchorEl) return;
    let openFrame: number | null = null;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
        !anchorEl.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    openFrame = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    });
    return () => {
      if (openFrame !== null) cancelAnimationFrame(openFrame);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [anchorEl]);

  if (!anchorEl) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] rounded-xl border bg-popover p-2 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
      style={{
        top: position.top,
        left: position.left,
        width: menuWidth,
      }}
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
    </div>
  );
}
