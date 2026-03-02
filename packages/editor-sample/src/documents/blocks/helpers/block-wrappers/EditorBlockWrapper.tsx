import React, { CSSProperties, useState } from 'react';

import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
  setSelectedBlockId,
  useSelectedBlockId,
} from '../../../editor/EditorContext';

import TuneMenu from './TuneMenu';

type TEditorBlockWrapperProps = {
  children: JSX.Element;
};

export default function EditorBlockWrapper({ children }: TEditorBlockWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const selectedBlockId = useSelectedBlockId();
  const blockId = useCurrentBlockId();

  const isSelected = selectedBlockId === blockId;

  const renderMenu = () => {
    if (!isSelected) return null;
    return <TuneMenu blockId={blockId} />;
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isEditing,
        onEditComplete: () => setIsEditing(false),
      } as any);
    }
    return child;
  });

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    maxWidth: '100%',
    borderRadius: '8px',
    outline: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : undefined,
    outlineOffset: '2px',
    transition: 'outline 0.15s ease',
  };

  return (
    <div
      style={wrapperStyle}
      onClick={(ev) => {
        setSelectedBlockId(blockId);
        setIsEditing(true);
        ev.stopPropagation();
        ev.preventDefault();
      }}
      data-testid={`editor-block-wrapper-${blockId}`}
    >
      {renderMenu()}
      {childrenWithProps}
    </div>
  );
}
