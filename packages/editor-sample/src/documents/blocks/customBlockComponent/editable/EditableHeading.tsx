import React, { memo, useEffect, useRef, useState } from 'react';

import { Heading } from '@usewaypoint/block-heading';

import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { renderTextWithVariables } from '../../../../components/VariablePill';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
  setDocument,
  useDocument,
  useVariables,
} from '../../../editor/EditorContext';

function getFontSize(level: string) {
  switch (level) {
    case 'h1':
      return 32;
    case 'h3':
      return 20;
    case 'h2':
    default:
      return 24;
  }
}

function EditableHeading(props: any) {
  const { isEditing, onEditComplete, ...headingProps } = props;
  const { style } = props;
  const { padding, fontFamily, fontWeight, color, backgroundColor, borderRadius, textAlign } = style || {};
  const level = props.props?.level ?? 'h2';

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
          backgroundColor: backgroundColor ?? undefined,
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          paddingTop: padding?.top ? `${padding.top}px` : 0,
          paddingBottom: padding?.bottom ? `${padding.bottom}px` : 0,
          paddingLeft: padding?.left ? `${padding.left}px` : 0,
          paddingRight: padding?.right ? `${padding.right}px` : 0,
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
            fontSize: getFontSize(level),
            fontWeight: fontWeight ?? 'bold',
            fontFamily: FONT_FAMILY_MAPPING[fontFamily as keyof typeof FONT_FAMILY_MAPPING] || 'inherit',
            color: color || 'inherit',
            textAlign: textAlign || 'left',
            margin: 0,
          }}
          data-testid="editable-heading-input"
        />
      </div>
    );
  }

  const hasVariables = /\{\{.*?\}\}/.test(currentText);
  if (hasVariables) {
    const blockUrl = props.template?.url ?? props.props?.url;
    const content = (
      <div
        style={{
          backgroundColor: backgroundColor ?? undefined,
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          paddingTop: padding?.top ? `${padding.top}px` : 0,
          paddingBottom: padding?.bottom ? `${padding.bottom}px` : 0,
          paddingLeft: padding?.left ? `${padding.left}px` : 0,
          paddingRight: padding?.right ? `${padding.right}px` : 0,
          fontSize: getFontSize(level),
          fontWeight: fontWeight ?? 'bold',
          fontFamily: FONT_FAMILY_MAPPING[fontFamily as keyof typeof FONT_FAMILY_MAPPING] || 'inherit',
          color: color || 'inherit',
          textAlign: textAlign || 'left',
          lineHeight: 1.3,
        }}
      >
        {renderTextWithVariables(currentText)}
      </div>
    );
    if (blockUrl) {
      return <a href={blockUrl} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a>;
    }
    return content;
  }

  return <Heading {...headingProps} />;
}

export default memo(EditableHeading);
