import React, { useState } from 'react';

  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Textarea } from '@/components/ui/textarea';
  import {
    resetDocument,
    resetVariables,
  } from '../../../documents/editor/EditorContext';
  import getGlobalVariables from '../../../utils/getGlobalVariables';

  import validateJsonStringValue from './validateJsonStringValue';

  type ImportJsonDialogProps = {
    onClose: () => void;
  };

  export default function ImportJsonDialog({ onClose }: ImportJsonDialogProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (ev) => {
      const v = ev.currentTarget.value;
      setValue(v);
      const { error } = validateJsonStringValue(v);
      setError(error ?? null);
    };

    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent data-testid="import-json-dialog">
          <DialogHeader>
            <DialogTitle>Import JSON</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              const { error, data } = validateJsonStringValue(value);
              setError(error ?? null);
              if (!data) return;
              const globalVariables = getGlobalVariables({ document: data });
              resetDocument(data);
              resetVariables(globalVariables);
              onClose();
            }}
          >
            <div className="flex flex-col gap-4 py-4">
              <p className="text-sm text-gray-600" data-testid="import-json-label">
                Copy and paste an EmailBuilder.js JSON (
                <a
                  href="https://gist.githubusercontent.com/jordanisip/efb61f56ba71bd36d3a9440122cb7f50/raw/30ea74a6ac7e52ebdc309bce07b71a9286ce2526/emailBuilderTemplate.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  example
                </a>
                ).
              </p>

              {error && (
                <div
                  className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700"
                  data-testid="import-json-error-alert"
                >
                  {error}
                </div>
              )}

              <Textarea
                value={value}
                onChange={handleChange}
                placeholder="Paste JSON here..."
                rows={10}
                className="font-mono text-xs resize-none"
                data-testid="import-json-textfield"
              />
              <p className="text-xs text-gray-400">This will override your current template.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} data-testid="import-json-cancel-button">
                Cancel
              </Button>
              <Button type="submit" disabled={error !== null} data-testid="import-json-import-button">
                Import
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  