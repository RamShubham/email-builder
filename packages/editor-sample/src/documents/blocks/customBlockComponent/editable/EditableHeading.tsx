import React, { memo, useEffect, useRef, useState } from 'react';

  import { Heading } from '@usewaypoint/block-heading';

  import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
  import { useCurrentBlockId } from '../../../editor/EditorBlock';
  import {
    setDocument,
    useDocument,
    useVariables,
  } from '../../../editor/EditorContext';

  function EditableHeading(props: any) {
    const { isEditing, onEditComplete, ...headingProps } = props;
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
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
          }}
          data-testid="editable-heading-input"
        />
      );
    }

    return <Heading {...headingProps} />;
  }

  export default memo(EditableHeading);
  