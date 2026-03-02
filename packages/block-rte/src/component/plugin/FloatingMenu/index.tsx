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
import { usePointerInteractions } from './hooks/usePointerInteractions';

type FloatingMenuCoords = { x: number; y: number } | undefined;

function FloatingMenuPlugin() {
	const ref = useRef<HTMLDivElement>(null);
	const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
	const [editor] = useLexicalComposerContext();

	const { isPointerDown, isPointerReleased } = usePointerInteractions();

	const calculatePosition = useCallback(() => {
		const domSelection = getSelection();
		const domRange =
			domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);

		if (!domRange || !ref.current || isPointerDown) {
			return setCoords(undefined);
		}

		computePosition(domRange, ref.current, { placement: 'top' })
			.then((pos) => {
				setCoords({ x: pos.x, y: pos.y - 10 });
			})
			.catch(() => {
				setCoords(undefined);
			});
	}, [isPointerDown]);

	const handleSelectionChange = useCallback(() => {
		if (
			editor.isComposing() ||
			editor.getRootElement() !== document.activeElement
		) {
			setCoords(undefined);
			return;
		}

		const selection = $getSelection();

		if (
			$isRangeSelection(selection) &&
			!selection.anchor.is(selection.focus)
		) {
			calculatePosition();
		} else {
			setCoords(undefined);
		}
	}, [editor, calculatePosition]);

	useEffect(() => {
		const unregisterListener = editor.registerUpdateListener(
			({ editorState }) => {
				editorState.read(() => handleSelectionChange());
			}
		);

		return unregisterListener;
	}, [editor, handleSelectionChange]);

	useEffect(() => {
		if (!coords && isPointerReleased) {
			editor.getEditorState().read(() => handleSelectionChange());
		}
		// Adding coords to the dependency array causes an issue if
		// a range selection is dismissed by navigating via arrow keys.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPointerReleased, handleSelectionChange, editor]);

	useEffect(() => {
		return editor.registerCommand(
			BLUR_COMMAND,
			(e) => {
				const floatingMenu = ref?.current;
				const relatedTarget = e?.relatedTarget as Node;

				if (
					floatingMenu &&
					relatedTarget &&
					floatingMenu?.contains(relatedTarget)
				) {
					// check if the blur is from the floating menu
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
