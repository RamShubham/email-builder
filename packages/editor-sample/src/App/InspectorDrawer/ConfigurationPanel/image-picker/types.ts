export type ImageSourceTab = 'unsplash' | 'gallery' | 'upload' | 'ai';

export type ImageSourceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelected: (url: string) => void;
  currentAlt?: string | null;
  currentWidth?: number | null;
  currentHeight?: number | null;
  workspaceId: string | null;
};
