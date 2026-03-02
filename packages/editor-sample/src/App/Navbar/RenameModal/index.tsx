import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type RenameModalProps = {
  open: boolean;
  onClose: () => void;
  initialTemplateName: string;
  onSave: ({ additionalData }: { additionalData: { name: string } }) => void;
  loading: boolean;
};

function RenameModal({
  open,
  onClose,
  initialTemplateName,
  onSave,
  loading = false,
}: RenameModalProps) {
  const [templateName, setTemplateName] = useState(initialTemplateName || '');

  const onSaveHandler = async () => {
    if (templateName === '') {
      toast.error('Please enter a name for email template.');
      return;
    }

    await onSave({ additionalData: { name: templateName } });
    onClose();
  };

  useEffect(() => {
    if (open) {
      setTemplateName(initialTemplateName || '');
    }
  }, [initialTemplateName, open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[560px]" data-testid="rename-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-gray-700" data-testid="save-icon" />
            Save Email Template as
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <div className="relative">
            <Input
              placeholder="Email Template Name"
              value={templateName}
              autoFocus
              className="pr-16"
              onChange={(e) => {
                setTemplateName(e.target.value.slice(0, 75));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveHandler();
                }
              }}
              data-testid="template-name-field"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
              data-testid="template-name-character-count"
            >
              {templateName?.length}/75
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveHandler}
            disabled={loading}
            data-testid="rename-modal-save-button"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RenameModal;
