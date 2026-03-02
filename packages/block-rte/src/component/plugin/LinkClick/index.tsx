import {
	$getSelection,
	$isRangeSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	createCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent } from '@lexical/utils';

// Define a custom command for link clicks
export const LINK_CLICK_COMMAND = createCommand('LINK_CLICK_COMMAND');

// Define the type for link click data
export type LinkClickData = {
	url: string;
	domElement: HTMLElement;
	position: {
		x: number;
		y: number;
	};
};

function LinkClickPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const unregisterClick = editor.registerCommand(
			CLICK_COMMAND,
			(event: MouseEvent) => {
				editor.getEditorState().read(() => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection)) return;

					const node = selection.anchor.getNode();
					const linkNode = $findMatchingParent(node, $isLinkNode);

					if (linkNode) {
						const domElement = editor.getElementByKey(
							linkNode.getKey()
						);
						if (domElement) {
							// Dispatch our custom command with the link data
							editor.dispatchCommand(LINK_CLICK_COMMAND, {
								url: linkNode.getURL(),
								domElement,
								position: {
									x: event.clientX,
									y: event.clientY,
								},
							});
						}
					}
				});
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);

		return () => {
			unregisterClick();
		};
	}, [editor]);

	return null;
}

export default LinkClickPlugin;
