import React, { memo, useEffect, useRef, useState } from 'react';

  import { Button } from '@usewaypoint/block-button';

  import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
  import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
  import { useCurrentBlockId } from '../../../editor/EditorBlock';
  import {
    setDocument,
    useDocument,
    useVariables,
  } from '../../../editor/EditorContext';

  function EditableButton(props: any) {
    const { isEditing, onEditComplete, ...buttonProps } = props;
    const { style } = props;
    const { padding, fontFamily, fontSize, textAlign, ...rest } = style || {};
    const [editedText, setEditedText] = useState(props.template?.text || props.props?.text || '');
    const blockId = useCurrentBlockId();
    const document = useDocument();
    const globalVariables = useVariables();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = () => {
      if (blockId && document[blockId]) {
        const block = document[blockId];
        setDocument({
          [blockId]: {
            ...block,
            data: {
              ...block.data,
              props: replaceTemplateVariables({ ...block.data.props, text: editedText }, globalVariables),
              template: { ...block.data.template, text: editedText },
            },
          },
        });
      }
      onEditComplete?.();
    };

    useEffect(() => {
      if (isEditing && inputRef.current) inputRef.current.focus();
    }, [isEditing]);

    if (isEditing) {
      return (
        <div style={{ padding: `${padding?.top || 0}px ${padding?.right || 0}px ${padding?.bottom || 0}px ${padding?.left || 0}px` }}>
          <input
            ref={inputRef}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleBlur}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: FONT_FAMILY_MAPPING[fontFamily] || 'inherit',
              fontSize: fontSize ? `${fontSize}px` : 'inherit',
              textAlign: textAlign || 'center',
              fontWeight: 'bold',
            }}
            data-testid="editable-button-input"
          />
        </div>
      );
    }

    return <Button {...buttonProps} />;
  }

  export default memo(EditableButton);
  