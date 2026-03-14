import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
  autoFocus?: boolean;
}

export default function ChatInput({ onSend, disabled, initialValue = '', autoFocus = true }: ChatInputProps) {
  console.log('[ChatInput v2] render — disabled:', disabled);
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0;

  return (
    <div className="mx-3 flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2 focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe your email…"
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none bg-transparent text-[13.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed disabled:opacity-60"
        style={{ minHeight: '24px', maxHeight: '120px' }}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSend && !disabled}
        className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5 ${
          disabled
            ? 'bg-violet-100 text-violet-400 cursor-default'
            : canSend
            ? 'bg-gray-900 text-white hover:bg-gray-700 active:scale-90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {disabled ? (
          <Square className="w-3 h-3 fill-current" />
        ) : (
          <ArrowUp className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
