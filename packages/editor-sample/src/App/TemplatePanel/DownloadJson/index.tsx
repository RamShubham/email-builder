import React, { useMemo } from 'react';

  import { FileDown } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
  import { useDocument } from '../../../documents/editor/EditorContext';

  export default function DownloadJson() {
    const doc = useDocument();
    const href = useMemo(() => {
      return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
    }, [doc]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-7 w-7 rounded-xl"
            data-testid="download-json-button"
          >
            <a href={href} download="emailTemplate.json">
              <FileDown className="h-4 w-4" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download JSON file</TooltipContent>
      </Tooltip>
    );
  }
  