import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { GenerateFromAITab } from './tabs/GenerateFromAi';
import { MyGalleryTab } from './tabs/MyGalleryTab';
import { UnsplashTab } from './tabs/UnsplashTab';
import { UploadTab } from './tabs/UploadTab';
import type { ImageSourceModalProps } from './types';

export function ImageSourceModal({
  open,
  onOpenChange,
  onImageSelected,
  currentAlt,
  currentWidth,
  currentHeight,
  workspaceId,
}: ImageSourceModalProps) {
  const handleImageSelected = (url: string) => {
    onImageSelected(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col"
        data-testid="image-source-modal"
        aria-label="Choose image"
      >
        <DialogHeader>
          <DialogTitle>Choose image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="unsplash" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4" aria-label="Image source tabs">
            <TabsTrigger value="unsplash" data-testid="image-source-tab-unsplash">
              Unsplash
            </TabsTrigger>
            <TabsTrigger value="gallery" data-testid="image-source-tab-gallery">
              My Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" data-testid="image-source-tab-upload">
              Upload
            </TabsTrigger>
            <TabsTrigger value="ai" data-testid="image-source-tab-ai">
              Generate from AI
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[520px] flex flex-col min-h-0">
            <TabsContent value="unsplash" className="mt-0 h-full" data-testid="image-source-content-unsplash">
              <UnsplashTab onImageSelected={handleImageSelected} />
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 h-full" data-testid="image-source-content-gallery">
              <MyGalleryTab workspaceId={workspaceId} onImageSelected={handleImageSelected} />
            </TabsContent>

            <TabsContent value="upload" className="mt-0 h-full" data-testid="image-source-content-upload">
              <UploadTab onImageSelected={handleImageSelected} workspaceId={workspaceId} />
            </TabsContent>

            <TabsContent value="ai" className="mt-0 h-full" data-testid="image-source-content-ai">
              <GenerateFromAITab
                onImageSelected={handleImageSelected}
                currentAlt={currentAlt ?? undefined}
                currentWidth={currentWidth}
                currentHeight={currentHeight}
                workspaceId={workspaceId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
