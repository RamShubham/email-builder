import React, { useState } from 'react';

  import { TOGGLE_LINK_COMMAND } from '@lexical/link';
  import { Edit2, ExternalLink, Trash2 } from 'lucide-react';

  import styles from './styles.module.scss';

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  function LinkPopover({ editor, isLink, url, setUrl, anchorEl, setLinkPopoverOpen }) {
    const [isEditing, setIsEditing] = useState(!isLink);
    const [inputUrl, setInputUrl] = useState(url || '');
    const isValid = !inputUrl || isValidUrl(inputUrl);

    const handleSave = () => {
      if (!isValidUrl(inputUrl)) return;
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: inputUrl, target: '_blank' });
      setUrl(inputUrl);
      setLinkPopoverOpen(false);
    };

    const rect = anchorEl?.getBoundingClientRect?.() ?? { bottom: 0, left: 0 };

    return (
      <div
        className={styles.popover}
        style={{
          position: 'fixed',
          top: rect.bottom + 8,
          left: rect.left,
          zIndex: 10001,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          padding: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          minWidth: 260,
        }}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://..."
              data-testid="floating-menu-link-input"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              autoFocus
            />
            {!isValid && <span className="text-xs text-red-500">Invalid URL</span>}
            <div className="flex gap-2 justify-end">
              <button
                className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                onClick={() => setLinkPopoverOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                onClick={handleSave}
                disabled={!isValid || !inputUrl}
                data-testid="floating-menu-link-save"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline max-w-[180px] truncate flex items-center gap-1"
            >
              {url}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
            <button
              className="p-1 rounded hover:bg-gray-100"
              onClick={() => setIsEditing(true)}
              data-testid="floating-menu-link-edit"
            >
              <Edit2 className="h-3.5 w-3.5 text-gray-600" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-100"
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                setLinkPopoverOpen(false);
              }}
              data-testid="floating-menu-link-delete"
            >
              <Trash2 className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    );
  }

  export default LinkPopover;
  