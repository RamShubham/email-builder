import React, { memo, useEffect, useRef, useState } from 'react';

import { Text } from '@usewaypoint/block-text';

import FONT_FAMILY_MAPPING from '../../../../constant/fontFamily';
import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
import { renderTextWithVariables } from '../../../../components/VariablePill';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
  setDocument,
  useDocument,
  useVariables,
} from '../../../editor/EditorContext';

function EditableText(props: any) {
  const { isEditing, onEditComplete, ...textProps } = props;
  const { style } = props;
  const { padding, fontSize, fontFamily, fontWeight, textAlign, color, backgroundColor, borderRadius, ...rest } = style || {};

  const currentText = props.template?.text ?? props.props?.text ?? '';
  const [editedText, setEditedText] = useState(currentText);
  const blockId = useCurrentBlockId();
  const document = useDocument();
  const globalVariables = useVariables();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          backgroundColor: backgroundColor ?? 'transparent',
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          resize: 'none',
          fontFamily: FONT_FAMILY_MAPPING[fontFamily] || 'inherit',
          fontSize: fontSize ? `${fontSize}px` : 'inherit',
          fontWeight: fontWeight || 'normal',
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

  const templateText = props.template?.text ?? '';
  const resolvedText = props.props?.text ?? '';
  const hasUnresolvedVariables = /{{.*?}}/.test(resolvedText);

  if (hasUnresolvedVariables) {
    const pillSourceText = resolvedText || templateText;
    console.log('pillSourceText >>', pillSourceText);
    const blockUrl = props.template?.url ?? props.props?.url;
    const content = (
      <div
        style={{
          fontFamily: FONT_FAMILY_MAPPING[fontFamily] || 'inherit',
          fontSize: fontSize ? `${fontSize}px` : 'inherit',
          fontWeight: fontWeight || 'normal',
          textAlign: textAlign || 'left',
          color: color || 'inherit',
          backgroundColor: backgroundColor ?? undefined,
          borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          paddingTop: padding?.top ? `${padding.top}px` : 0,
          paddingBottom: padding?.bottom ? `${padding.bottom}px` : 0,
          paddingLeft: padding?.left ? `${padding.left}px` : 0,
          paddingRight: padding?.right ? `${padding.right}px` : 0,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {renderTextWithVariables(pillSourceText)}
      </div>
    );

    if (blockUrl) {
      return (
        <a
          href={blockUrl}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {content}
        </a>
      );
    }

    return content;
  }

  return <Text {...textProps} />;
}

export default memo(EditableText);
