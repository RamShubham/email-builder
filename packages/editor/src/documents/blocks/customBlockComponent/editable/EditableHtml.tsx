import React, { memo, useEffect, useRef, useState } from 'react';

  import { Html } from '@usewaypoint/block-html';

  import { replaceTemplateVariables } from '../../../../utils/replaceTemplateVariables';
  import { useCurrentBlockId } from '../../../editor/EditorBlock';
  import {
    setDocument,
    useDocument,
    useVariables,
  } from '../../../editor/EditorContext';

  function EditableHtml(props: any) {
    const { isEditing, onEditComplete, ...htmlProps } = props;
    const currentContents = props.template?.contents ?? props.props?.contents ?? '';
    const [editedContents, setEditedContents] = useState(currentContents);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (!isEditing) setEditedContents(currentContents);
    }, [currentContents, isEditing]);

    useEffect(() => {
      if (isEditing && textareaRef.current) textareaRef.current.focus();
    }, [isEditing]);

    const blockId = useCurrentBlockId();
    const document = useDocument();
    const globalVariables = useVariables();

    const handleBlur = () => {
      if (blockId && document[blockId]) {
        const block = document[blockId];
        setDocument({
          [blockId]: {
            ...block,
            data: {
              ...block.data,
              props: replaceTemplateVariables({ ...block.data.props, contents: editedContents }, globalVariables),
              template: { ...block.data.template, contents: editedContents },
            },
          },
        });
      }
      onEditComplete?.();
    };

    if (isEditing) {
      return (
        <textarea
          ref={textareaRef}
          value={editedContents}
          onChange={(e) => setEditedContents(e.target.value)}
          onBlur={handleBlur}
          style={{ width: '100%', minHeight: 80, fontFamily: 'monospace', fontSize: 12, padding: 8, border: '1px solid #e5e7eb', outline: 'none' }}
          data-testid="editable-html-input"
        />
      );
    }

    return <Html {...htmlProps} />;
  }

  export default memo(EditableHtml);
  