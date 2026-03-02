import React, { useMemo } from 'react';

  import { useDocument } from '../../documents/editor/EditorContext';
  import swapPropsAndTemplate from '../../utils/swapPropsAndTemplate';

  import HighlightedCodePanel from './helper/HighlightedCodePanel';

  export default function JsonPanel() {
    const document = useDocument();
    const updateDocument = swapPropsAndTemplate(document);
    const code = useMemo(() => JSON.stringify(updateDocument, null, '  '), [updateDocument]);
    return <HighlightedCodePanel type="json" value={code} />;
  }
  