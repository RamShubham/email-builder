import React, { memo, useEffect, useRef, useState } from 'react';

  import { Text } from '@usewaypoint/block-text';

  import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
  import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
  import { useCurrentBlockId } from '../../../editor/EditorBlock';
  import {
    setDocument,
    useDocument,
    useVariables,
  } from '../../../editor/EditorContext';

  function EditableText(props: any) {
    const { isEditing, onEditComplete, ...textProps } = props;
    const { style } = props;
    const { padding, fontSize, fontFamily, textAlign, color, ...rest } = style || {};

    const [editedText, setEditedText] = useState(props.template?.text || props.props?.text || '');
    const blockId = useCurrentBlockId();
    const document = useDocument();
    const globalVariables = useVariables();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [isEditing]);

    if (isEditing) {
      return (
        <textarea
          ref={textareaRef}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: 'none',
            fontFamily: FONT_FAMILY_MAPPING[fontFamily] || 'inherit',
            fontSize: fontSize ? `${fontSize}px` : 'inherit',
            textAlign: textAlign || 'left',
            color: color || 'inherit',
            paddingTop: padding?.top ? `${padding.top}px` : 0,
            paddingBottom: padding?.bottom ? `${padding.bottom}px` : 0,
            paddingLeft: padding?.left ? `${padding.left}px` : 0,
            paddingRight: padding?.right ? `${padding.right}px` : 0,
          }}
          rows={4}
          data-testid="editable-text-input"
        />
      );
    }

    return <Text {...textProps} />;
  }

  export default memo(EditableText);
  