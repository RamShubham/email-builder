import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const API_BASE = `${process.env.REACT_APP_AI_BASE_URL ?? ''}api/`;

type AspectRatio = 'landscape' | 'square' | 'portrait';

const STAGE_MESSAGES = [
  'Analyzing your prompt...',
  'Creating composition...',
  'Generating details...',
  'Adding final touches...',
  'Almost there...',
];

const HELPFUL_TIPS = [
  'Tip: Add art style keywords like \'watercolor\' or \'photorealistic\' for better results',
  'Tip: Describe lighting and mood for more atmospheric images',
  'Tip: Mention specific colors to guide the palette of your image',
  'Tip: Include perspective details like "bird\'s eye view" or "close-up" for composition',
  'Tip: Reference a time of day like "golden hour" or "midnight" for lighting effects',
  'Tip: Add texture descriptions like "glossy", "matte", or "textured" for more detail',
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; w: number; h: number }[] = [
  { value: 'landscape', label: 'Landscape', w: 24, h: 16 },
  { value: 'square', label: 'Square', w: 18, h: 18 },
  { value: 'portrait', label: 'Portrait', w: 16, h: 24 },
];

function useRotatingIndex(items: string[], intervalMs: number, active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const id = setInterval(() => setIndex((prev) => (prev + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [active, items.length, intervalMs]);
  return index;
}

function useElapsedSeconds(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return seconds;
}

function GeneratingAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #a78bfa, #818cf8, #8b5cf6)',
          backgroundSize: '400% 400%',
          animation: 'shimmerGradient 3s ease infinite',
        }}
      />
      <div
        className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm"
        style={{ animation: 'morphPulse 2s ease-in-out infinite' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles
          className="w-8 h-8 text-white drop-shadow-lg"
          style={{ animation: 'sparkleRotate 4s linear infinite' }}
        />
      </div>
      <style>{`
        @keyframes shimmerGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes morphPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; border-radius: 12px; }
          50% { transform: scale(0.85); opacity: 0.6; border-radius: 20px; }
        }
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function LoadingExperience() {
  const stageIndex = useRotatingIndex(STAGE_MESSAGES, 3500, true);
  const tipIndex = useRotatingIndex(HELPFUL_TIPS, 7000, true);
  const elapsed = useElapsedSeconds(true);
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <GeneratingAnimation />
      <div className="flex flex-col items-center gap-1.5 min-h-[44px]">
        <p
          key={`stage-${stageIndex}`}
          className="text-sm font-medium text-gray-700"
          style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
        >
          {STAGE_MESSAGES[stageIndex]}
        </p>
        <p className="text-xs text-gray-400 tabular-nums">Generating... {elapsed}s</p>
      </div>
      <p
        key={`tip-${tipIndex}`}
        className="text-xs text-gray-400 text-center px-4 leading-relaxed italic"
        style={{ animation: 'fadeSlideIn 0.5s ease-out' }}
      >
        {HELPFUL_TIPS[tipIndex]}
      </p>
    </div>
  );
}

function AspectRatioIcon({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <rect
        x="0.5"
        y="0.5"
        width={w - 1}
        height={h - 1}
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

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
};

export function GenerateFromAITab({
  onImageSelected,
  currentAlt,
  currentWidth,
  currentHeight,
}: GenerateFromAITabProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');

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
      const token = typeof window !== 'undefined' ? (window as unknown as { accessToken?: string }).accessToken : undefined;
      const res = await fetch(`${API_BASE}image/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { token, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: prompt.trim(), aspectRatio }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Generation failed');
      }
      if (!data?.url) {
        throw new Error(data?.error || 'No image returned');
      }
      setGeneratedPreview(data.url);
      setGeneratedUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
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
    <div className="flex flex-col gap-4 h-[420px]" data-testid="image-source-content-ai">
      <textarea
        placeholder="Describe the image you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
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
