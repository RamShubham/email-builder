import { COMMAND_PRIORITY_CRITICAL } from 'lexical';
import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { LINK_CLICK_COMMAND, LinkClickData } from '.';

interface LinkClickHandlerProps {
	onLinkClick?: (data: LinkClickData) => void;
}

function useLinkClickHandler({ onLinkClick }: LinkClickHandlerProps) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const unregister = editor.registerCommand(
			LINK_CLICK_COMMAND,
			(data: LinkClickData) => {
				if (onLinkClick) {
					onLinkClick(data);
				}
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);

		return () => {
			unregister();
		};
	}, [editor, onLinkClick]);

	return null;
}

export default useLinkClickHandler;
