import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { uploadFile } from '../api/upload';

const MAX_FILE_MB = 4;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

type UploadTabProps = {
  onImageSelected: (url: string) => void;
};

export function UploadTab({ onImageSelected }: UploadTabProps) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateAndApplyUrl = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setUrlError(null);
    const img = new Image();
    img.onload = () => {
      onImageSelected(trimmed);
    };
    img.onerror = () => {
      setUrlError('Invalid URL');
    };
    img.src = trimmed;
  }, [url, onImageSelected]);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_MB) {
        setUploadError(`File size must be under ${MAX_FILE_MB} MB`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError('Only JPEG, PNG, WEBP and GIF are allowed.');
        return;
      }
      setUploadError(null);
      setUploading(true);
      try {
        const cdnUrl = await uploadFile(file);
        onImageSelected(cdnUrl);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onImageSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    handleFile(f ?? null);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-4 h-[420px]" data-testid="image-source-content-upload">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600">Image URL</label>
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && validateAndApplyUrl()}
            disabled={uploading}
            data-testid="upload-url-input"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={validateAndApplyUrl}
            disabled={!url.trim() || uploading}
            data-testid="upload-url-button"
          >
            Use URL
          </Button>
        </div>
        {urlError && (
          <p className="text-sm text-red-600" data-testid="upload-url-error">
            {urlError}
          </p>
        )}
      </div>
      <div className="text-xs font-medium text-gray-600">Or upload a file (JPEG, PNG, WEBP, GIF, max 4 MB)</div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-gray-50/50'
          } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
        data-testid="upload-dropzone"
      >
        <input
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={onInputChange}
          className="hidden"
          id="image-upload-input"
          data-testid="upload-file-input"
        />
        <label htmlFor="image-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-gray-500" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Drop an image here or click to browse'}
          </span>
        </label>
      </div>
      {uploadError && (
        <p className="text-sm text-red-600" data-testid="upload-file-error">
          {uploadError}
        </p>
      )}
    </div>
  );
}
