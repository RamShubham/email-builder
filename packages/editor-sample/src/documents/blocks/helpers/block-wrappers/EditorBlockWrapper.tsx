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

    let outline: CSSProperties['outline'];
    if (selectedBlockId === blockId) {
      outline = '2px solid #2196F3';
    }

    const renderMenu = () => {
      if (selectedBlockId !== blockId) return null;
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

    return (
      <div
        style={{ position: 'relative', maxWidth: '100%', outline }}
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
  