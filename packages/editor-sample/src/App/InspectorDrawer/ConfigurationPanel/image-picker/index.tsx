import React, { useState } from 'react';

import { Upload, Sparkles, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

function ImagePickerPanel({ onChange, currentAlt }: { onChange: (url: string) => void; currentAlt?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'url' | 'ai'>('url');
  const [url, setUrl] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');

  const resetState = () => {
    setGeneratedPreview('');
    setGeneratedUrl('');
    setAiPrompt('');
    setUrl('');
    setError('');
    setTab('url');
  };

  const onClose = () => {
    setIsOpen(false);
    resetState();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleConfirmUrl = () => {
    if (url.trim()) {
      onChange(url.trim());
      onClose();
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedPreview('');
    setGeneratedUrl('');
    setError('');

    try {
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (!data.url) throw new Error('No image returned');
      setGeneratedPreview(data.url);
      setGeneratedUrl(data.url);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyGenerated = () => {
    if (generatedUrl) {
      onChange(generatedUrl);
      onClose();
    }
  };

  const openUrlTab = () => {
    resetState();
    setTab('url');
    setIsOpen(true);
  };

  const openAiTab = () => {
    resetState();
    setTab('ai');
    if (currentAlt && currentAlt.length > 10) {
      setAiPrompt(currentAlt);
    }
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={openUrlTab}
          data-testid="inspect-panel-image-picker-button"
          className="gap-2 flex-1"
        >
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
        <Button
          variant="outline"
          onClick={openAiTab}
          className="gap-2 flex-1 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
        >
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent data-testid="inspect-panel-image-picker-dialog" className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {tab === 'url' ? 'Image URL' : 'Generate Image with AI'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center bg-gray-100/80 rounded-xl p-0.5 gap-0.5 mb-3">
            <button
              className={`flex-1 h-8 text-xs font-medium rounded-[10px] transition-all ${
                tab === 'url'
                  ? 'bg-white shadow-sm text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('url')}
            >
              URL
            </button>
            <button
              className={`flex-1 h-8 text-xs font-medium rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${
                tab === 'ai'
                  ? 'bg-white shadow-sm text-violet-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setTab('ai')}
            >
              <Sparkles className="h-3 w-3" />
              AI Generate
            </button>
          </div>

          {tab === 'url' ? (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmUrl(); }}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirmUrl} disabled={!url.trim()}>Confirm</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <textarea
                  placeholder="Describe the image you want to generate..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white"
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
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {isGenerating && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm text-gray-500">Creating your image...</p>
                  </div>
                </div>
              )}

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
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="gap-1.5"
                    >
                      Regenerate
                    </Button>
                    <Button
                      onClick={handleApplyGenerated}
                      className="gap-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white"
                    >
                      Use This Image
                    </Button>
                  </div>
                </div>
              )}

              {!generatedPreview && !isGenerating && (
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImagePickerPanel;
