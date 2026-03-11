import React, { useMemo } from 'react';

  import { useDocument } from '../../documents/editor/EditorContext';
  import generateHtml from '../../utils/generateHtml';

  import HighlightedCodePanel from './helper/HighlightedCodePanel';

  export default function HtmlPanel() {
    const document = useDocument();
    const code = useMemo(() => generateHtml(document), [document]);
    return <HighlightedCodePanel type="html" value={code} />;
  }
  