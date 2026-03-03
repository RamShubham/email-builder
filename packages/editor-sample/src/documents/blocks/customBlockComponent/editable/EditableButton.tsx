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
    const { padding, fontFamily, fontSize, textAlign, backgroundColor: wrapperBg, ...rest } = style || {};
    const buttonBg = props.props?.buttonBackgroundColor ?? '#999999';
    const buttonTextColor = props.props?.buttonTextColor ?? '#FFFFFF';
    const buttonStyle = props.props?.buttonStyle ?? 'rounded';
    const buttonBorderRadius = buttonStyle === 'pill' ? 64 : buttonStyle === 'rectangle' ? 0 : 4;
    const fullWidth = props.props?.fullWidth ?? false;
    const size = props.props?.size ?? 'medium';
    const buttonPadding = size === 'x-small' ? '4px 8px' : size === 'small' ? '8px 12px' : size === 'large' ? '16px 32px' : '12px 20px';
    const buttonFontWeight = style?.fontWeight ?? 'bold';
    const currentText = props.template?.text ?? props.props?.text ?? '';
    const [editedText, setEditedText] = useState(currentText);
    const blockId = useCurrentBlockId();
    const document = useDocument();
    const globalVariables = useVariables();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!isEditing) setEditedText(currentText);
    }, [currentText, isEditing]);

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
        <div
          style={{
            padding: `${padding?.top || 0}px ${padding?.right || 0}px ${padding?.bottom || 0}px ${padding?.left || 0}px`,
            backgroundColor: wrapperBg ?? undefined,
            textAlign: textAlign ?? undefined,
          }}
        >
          <div
            style={{
              display: fullWidth ? 'block' : 'inline-block',
              backgroundColor: buttonBg,
              borderRadius: buttonBorderRadius,
              padding: buttonPadding,
            }}
          >
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
                fontSize: fontSize ? `${fontSize}px` : 16,
                textAlign: textAlign ?? undefined,
                fontWeight: buttonFontWeight,
                color: buttonTextColor,
              }}
              data-testid="editable-button-input"
            />
          </div>
        </div>
      );
    }

    return <Button {...buttonProps} />;
  }

  export default memo(EditableButton);
  