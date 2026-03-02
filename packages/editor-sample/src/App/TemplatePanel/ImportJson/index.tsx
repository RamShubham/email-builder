import React, { useState } from 'react';

  import { FileUp } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

  import ImportJsonDialog from './ImportJsonDialog';

  export default function ImportJson() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              data-testid="import-json-button"
              className="h-8 w-8"
            >
              <FileUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import JSON file</TooltipContent>
        </Tooltip>

        {open ? <ImportJsonDialog onClose={() => setOpen(false)} /> : null}
      </>
    );
  }
  