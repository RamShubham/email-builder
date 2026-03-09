import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { type GalleryImage, listImages } from '../sdk/gallery';

type MyGalleryTabProps = {
  workspaceId: string | null;
  onImageSelected: (url: string) => void;
};

export function MyGalleryTab({ workspaceId, onImageSelected }: MyGalleryTabProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadPage = useCallback(async (wsId: string, p: number, append: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const { docs, has_next_page } = await listImages({
        workspace_id: wsId,
        page: p,
        limit: 20,
      });
      setImages((prev) => (append ? [...prev, ...docs] : docs));
      setHasMore(has_next_page);
      setHasLoadedOnce(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
      if (!append) setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!workspaceId) {
      setImages([]);
      setPage(1);
      return;
    }
    setPage(1);
    loadPage(workspaceId, 1, false);
  }, [workspaceId, loadPage]);

  const loadMore = () => {
    if (!workspaceId || isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(workspaceId, nextPage, true);
  };

  if (!workspaceId) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6" data-testid="gallery-no-workspace">
        Workspace required to load gallery.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full" data-testid="image-source-content-gallery">
      {error && (
        <p className="text-sm text-red-600" data-testid="gallery-error">
          {error}
        </p>
      )}
      {isLoading && images.length === 0 && (
        <div className="flex items-center justify-center py-10 h-[420px]" data-testid="gallery-loading">
          <p className="text-sm text-muted-foreground">Loading images...</p>
        </div>
      )}

      {!isLoading && images.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-6" data-testid="gallery-empty">
          {hasLoadedOnce ? 'No images in gallery yet.' : 'Loading images...'}
        </p>
      )}

      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto">
            {images.map((img) => (
              <button
                key={img._id}
                type="button"
                className="relative aspect-video rounded-md overflow-hidden border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                onClick={() => onImageSelected(img.url)}
                data-testid={`gallery-image-${img._id}`}
              >
                <img
                  src={img.url}
                  alt={img.name ?? ''}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {hasMore && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadMore}
              disabled={isLoading}
              className="w-full"
              data-testid="gallery-load-more"
            >
              {isLoading ? 'Loading...' : 'Load more'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
