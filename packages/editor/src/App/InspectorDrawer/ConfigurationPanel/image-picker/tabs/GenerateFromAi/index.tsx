
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import useRequest from '../../../../../../hook/useRequest';

import AspectRatioIcon from './AspectRatioIcon';
import { ASPECT_RATIOS, type AspectRatio } from './constant';
import LoadingExperience from './LoadingExperience';

function detectAspectRatio(width?: number | null, height?: number | null): AspectRatio {
  if (width && height) {
    const ratio = width / height;
    if (ratio > 1.2) return 'landscape';
    if (ratio < 0.8) return 'portrait';
    return 'square';
  }
  return 'landscape';
}

type GenerateFromAITabProps = {
  onImageSelected: (url: string) => void;
  currentAlt?: string | null;
  currentWidth?: number | null;
  currentHeight?: number | null;
  workspaceId: string | null;
};

export function GenerateFromAITab({
  onImageSelected,
  currentAlt,
  currentWidth,
  currentHeight,
  workspaceId,
}: GenerateFromAITabProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');

  const [, generateImageRequest] = useRequest(
    {
      method: 'post',
      url: '/api/image/generate',
    },
    { manual: true }
  );

  useEffect(() => {
    setAspectRatio(detectAspectRatio(currentWidth, currentHeight));
    if (currentAlt && currentAlt.length > 10) {
      setPrompt(currentAlt);
    }
  }, [currentAlt, currentWidth, currentHeight]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedPreview('');
    setGeneratedUrl('');
    setError('');
    try {
      const { data } = await generateImageRequest({
        data: { prompt: prompt.trim(), aspectRatio, workspaceId },
      });

      if (!data?.url) {
        throw new Error(data?.error || 'No image returned');
      }
      setGeneratedPreview(data.url);
      setGeneratedUrl(data.url);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to generate image. Please try again.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedUrl) {
      onImageSelected(generatedUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto" data-testid="image-source-content-ai">
      <textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full shrink-0 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
        data-testid="ai-prompt-input"
      />

      <div>
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">Aspect Ratio</label>
        <div className="flex gap-1.5">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.value}
              type="button"
              onClick={() => setAspectRatio(ar.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl border transition-all ${aspectRatio === ar.value
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500'
                }`}
              data-testid={`ai-aspect-${ar.value}`}
            >
              <AspectRatioIcon w={ar.w} h={ar.h} />
              <span className="text-[11px] font-medium">{ar.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white"
        data-testid="ai-generate-button"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" data-testid="ai-error">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="min-w-0 whitespace-pre-wrap break-all [overflow-wrap:anywhere]">{error}</p>
        </div>
      )}

      {isGenerating && <LoadingExperience />}

      {generatedPreview && !isGenerating && (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <img
              src={generatedPreview}
              alt="Generated preview"
              className="w-full h-auto max-h-[240px] object-contain"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              data-testid="ai-regenerate"
            >
              Regenerate
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="gap-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white"
              data-testid="ai-use-image"
            >
              Use This Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
