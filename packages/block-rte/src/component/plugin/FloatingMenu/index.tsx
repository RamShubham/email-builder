import {
        $getSelection,
        $isRangeSelection,
        BLUR_COMMAND,
        COMMAND_PRIORITY_LOW,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { computePosition } from '@floating-ui/dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import FloatingMenu from './FloatingMenu';

type FloatingMenuCoords = { x: number; y: number } | undefined;

function FloatingMenuPlugin() {
        const ref = useRef<HTMLDivElement>(null);
        const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
        const [editor] = useLexicalComposerContext();
        const isPointerDownRef = useRef(false);

        useEffect(() => {
                const onPointerDown = () => { isPointerDownRef.current = true; };
                const onPointerUp = () => {
                        isPointerDownRef.current = false;
                        setTimeout(() => {
                                editor.getEditorState().read(() => {
                                        checkSelection();
                                });
                        }, 10);
                };
                document.addEventListener('pointerdown', onPointerDown);
                document.addEventListener('pointerup', onPointerUp);
                return () => {
                        document.removeEventListener('pointerdown', onPointerDown);
                        document.removeEventListener('pointerup', onPointerUp);
                };
        }, [editor]);

        const checkSelection = useCallback(() => {
                if (isPointerDownRef.current) return;

                const rootElement = editor.getRootElement();
                if (!rootElement) {
                        setCoords(undefined);
                        return;
                }

                const activeElement = document.activeElement;
                const isEditorFocused = rootElement === activeElement || rootElement.contains(activeElement);

                if (!isEditorFocused || editor.isComposing()) {
                        setCoords(undefined);
                        return;
                }

                const selection = $getSelection();
                if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus)) {
                        const domSelection = window.getSelection();
                        const domRange = domSelection?.rangeCount ? domSelection.getRangeAt(0) : null;

                        if (!domRange || !ref.current) {
                                setCoords(undefined);
                                return;
                        }

                        computePosition(domRange, ref.current, { placement: 'top' })
                                .then((pos) => {
                                        setCoords({ x: pos.x, y: pos.y - 10 });
                                })
                                .catch(() => {
                                        setCoords(undefined);
                                });
                } else {
                        setCoords(undefined);
                }
        }, [editor]);

        useEffect(() => {
                return editor.registerUpdateListener(({ editorState }) => {
                        editorState.read(() => {
                                checkSelection();
                        });
                });
        }, [editor, checkSelection]);

        useEffect(() => {
                return editor.registerCommand(
                        BLUR_COMMAND,
                        (e) => {
                                const floatingMenu = ref?.current;
                                const relatedTarget = e?.relatedTarget as Node;
                                if (floatingMenu && relatedTarget && floatingMenu.contains(relatedTarget)) {
                                        return true;
                                }
                                setCoords(undefined);
                                return false;
                        },
                        COMMAND_PRIORITY_LOW
                );
        }, [editor]);

        return <FloatingMenu ref={ref} editor={editor} coords={coords} />;
}

export default FloatingMenuPlugin;
