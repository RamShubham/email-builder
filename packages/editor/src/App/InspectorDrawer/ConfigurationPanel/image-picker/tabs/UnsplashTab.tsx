import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { getImagesFromUnsplash, type UnsplashImage } from '../sdk/unsplash';

const DEBOUNCE_MS = 400;
const INITIAL_QUERY = 'random';

type UnsplashTabProps = {
  onImageSelected: (url: string) => void;
};

export function UnsplashTab({ onImageSelected }: UnsplashTabProps) {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pendingSkeletonCount, setPendingSkeletonCount] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);


  const loadPage = useCallback(async (q: string, p: number, append: boolean) => {
    const normalized = q.trim();
    const effectiveQuery = normalized || INITIAL_QUERY;

    setIsLoading(true);
    setError(null);
    try {
      const results = await getImagesFromUnsplash({ query: effectiveQuery, page: p });
      setImages((prev) => (append ? [...prev, ...results] : results));
      setHasMore(results.length >= 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      if (!append) setImages([]);
    } finally {
      setIsLoading(false);
      if (append) {
        setPendingSkeletonCount(0);
      }
    }
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        setPage(1);
        loadPage(q, 1, false);
      }, DEBOUNCE_MS),
    [loadPage]
  );

  useEffect(() => {
    // initial load
    setPage(1);
    loadPage(INITIAL_QUERY, 1, false);
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, loadPage]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPendingSkeletonCount(4);
    setPage(nextPage);
    loadPage(query, nextPage, true);
  };

  const handleSelect = (img: UnsplashImage) => {
    const url = img.urls?.regular ?? img.urls?.small ?? img.url ?? '';
    if (url) onImageSelected(url);
  };

  const hasImages = images.length > 0;
  const isInitialLoad = isLoading && !hasImages;

  useEffect(() => {
    if (pendingSkeletonCount > 0) {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [pendingSkeletonCount]);

  return (
    <div className="flex flex-col gap-3 h-full" data-testid="image-source-content-unsplash">
      <div className="relative p-1 -m-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for images..."
          value={query}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            debouncedSearch(next);
          }}
          className="pl-10"
          data-testid="unsplash-search-input"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" data-testid="unsplash-error">
          {error}
        </p>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-3">
        {isInitialLoad && (
          <div className="flex items-center justify-center flex-1" data-testid="unsplash-loading">
            <p className="text-sm text-muted-foreground">Loading images...</p>
          </div>
        )}

        {!isInitialLoad && !isLoading && !hasImages && !error && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-muted-foreground text-center py-6" data-testid="unsplash-no-results">
              No images found. Try a different keyword.
            </p>
          </div>
        )}

        {hasImages && (
          <div className="flex flex-col h-full gap-3">
            <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    className="relative aspect-video rounded-md overflow-hidden border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                    onClick={() => handleSelect(img)}
                    data-testid={`unsplash-image-${img.id}`}
                  >
                    <img
                      src={img.urls?.small ?? img.urls?.regular ?? img.url ?? ''}
                      alt={img.alt_description ?? ''}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {pendingSkeletonCount > 0 &&
                  Array.from({ length: pendingSkeletonCount }).map((_, index) => (
                    <div
                      key={`unsplash-skeleton-${index}`}
                      className="relative aspect-video rounded-md overflow-hidden border border-muted-foreground/30 bg-background"
                      data-testid={`unsplash-skeleton-${index}`}
                    >
                      <Skeleton className="h-full w-full bg-[#dcdcdc]" />
                    </div>
                  ))}
              </div>
            </div>



            {hasMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={isLoading}
                className="w-full flex-shrink-0"
                data-testid="unsplash-load-more"
              >
                {isLoading ? 'Loading...' : 'Load more'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
