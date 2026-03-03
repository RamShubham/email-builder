import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LexicalEditor } from 'lexical';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';

const isValidUrl = (url: string) => {
        try {
                new URL(url);
                return true;
        } catch {
                return false;
        }
};

interface LinkPopoverProps {
        editor: LexicalEditor;
        isLink: boolean;
        url: string;
        setUrl: (url: string) => void;
        anchorEl: HTMLElement | null;
        onClose: () => void;
}

function LinkPopover({ editor, isLink, url, setUrl, anchorEl, onClose }: LinkPopoverProps) {
        const [isEditing, setIsEditing] = useState(!isLink);
        const [inputUrl, setInputUrl] = useState(url || '');
        const popoverRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
        const isValid = !inputUrl || isValidUrl(inputUrl);

        useEffect(() => {
                if (!anchorEl) return;
                const updatePosition = () => {
                        const rect = anchorEl.getBoundingClientRect();
                        const popoverWidth = 300;
                        const popoverHeight = 120;
                        let left = rect.left + rect.width / 2 - popoverWidth / 2;
                        left = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8));
                        let top = rect.bottom + 8;
                        if (top + popoverHeight > window.innerHeight - 8) {
                                top = rect.top - popoverHeight - 8;
                        }
                        top = Math.max(8, top);
                        setPosition({ top, left });
                };
                updatePosition();
                window.addEventListener('scroll', updatePosition, true);
                window.addEventListener('resize', updatePosition);
                return () => {
                        window.removeEventListener('scroll', updatePosition, true);
                        window.removeEventListener('resize', updatePosition);
                };
        }, [anchorEl]);

        useEffect(() => {
                if (isEditing && inputRef.current) {
                        inputRef.current.focus();
                }
        }, [isEditing]);

        useEffect(() => {
                const handleClickOutside = (e: MouseEvent) => {
                        if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                                onClose();
                        }
                };
                const timer = setTimeout(() => {
                        document.addEventListener('mousedown', handleClickOutside);
                }, 0);
                return () => {
                        clearTimeout(timer);
                        document.removeEventListener('mousedown', handleClickOutside);
                };
        }, [onClose]);

        const handleSave = () => {
                if (!isValidUrl(inputUrl)) return;
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: inputUrl, target: '_blank' });
                setUrl(inputUrl);
                onClose();
        };

        const handleRemove = () => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                onClose();
        };

        const popoverContent = (
                <div
                        ref={popoverRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                                position: 'fixed',
                                top: position.top,
                                left: position.left,
                                zIndex: 99999,
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                                padding: 12,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                                width: 300,
                        }}
                >
                        {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputUrl}
                                                onChange={(e) => setInputUrl(e.target.value)}
                                                placeholder="https://example.com"
                                                data-testid="floating-menu-link-input"
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
                                                style={{
                                                        width: '100%',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: 6,
                                                        padding: '6px 8px',
                                                        fontSize: 13,
                                                        outline: 'none',
                                                        boxSizing: 'border-box',
                                                }}
                                        />
                                        {!isValid && <span style={{ fontSize: 12, color: '#ef4444' }}>Please enter a valid URL</span>}
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button
                                                        type="button"
                                                        onClick={onClose}
                                                        style={{
                                                                padding: '4px 10px',
                                                                fontSize: 12,
                                                                borderRadius: 6,
                                                                border: '1px solid #d1d5db',
                                                                background: 'white',
                                                                cursor: 'pointer',
                                                        }}
                                                >
                                                        Cancel
                                                </button>
                                                <button
                                                        type="button"
                                                        onClick={handleSave}
                                                        disabled={!isValid || !inputUrl}
                                                        data-testid="floating-menu-link-save"
                                                        style={{
                                                                padding: '4px 10px',
                                                                fontSize: 12,
                                                                borderRadius: 6,
                                                                border: 'none',
                                                                background: (!isValid || !inputUrl) ? '#93c5fd' : '#3b82f6',
                                                                color: 'white',
                                                                cursor: (!isValid || !inputUrl) ? 'default' : 'pointer',
                                                                opacity: (!isValid || !inputUrl) ? 0.6 : 1,
                                                        }}
                                                >
                                                        Save
                                                </button>
                                        </div>
                                </div>
                        ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                        fontSize: 13,
                                                        color: '#2563eb',
                                                        textDecoration: 'none',
                                                        maxWidth: 180,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                }}
                                        >
                                                {url}
                                                <ExternalLink style={{ width: 12, height: 12, flexShrink: 0 }} />
                                        </a>
                                        <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                data-testid="floating-menu-link-edit"
                                                style={{
                                                        padding: 4,
                                                        borderRadius: 4,
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                }}
                                        >
                                                <Edit2 style={{ width: 14, height: 14, color: '#6b7280' }} />
                                        </button>
                                        <button
                                                type="button"
                                                onClick={handleRemove}
                                                data-testid="floating-menu-link-delete"
                                                style={{
                                                        padding: 4,
                                                        borderRadius: 4,
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                }}
                                        >
                                                <Trash2 style={{ width: 14, height: 14, color: '#6b7280' }} />
                                        </button>
                                </div>
                        )}
                </div>
        );

        if (!anchorEl) return null;

        return createPortal(popoverContent, document.body);
}

export default LinkPopover;
