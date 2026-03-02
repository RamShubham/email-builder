import React, { useState } from 'react';

  import { Upload } from 'lucide-react';

  import { Button } from '@/components/ui/button';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';

  function ImagePickerPanel({ onChange }: { onChange: (url: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');

    const onClose = () => setIsOpen(false);

    const handleConfirm = () => {
      if (url.trim()) {
        onChange(url.trim());
        onClose();
      }
    };

    return (
      <>
        <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          data-testid="inspect-panel-image-picker-button"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent data-testid="inspect-panel-image-picker-dialog">
            <DialogHeader>
              <DialogTitle>Image URL</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <Input
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={!url.trim()}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  export default ImagePickerPanel;
  