import {
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_CRITICAL,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import { $isLinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';

const useFloatingMenu = ({ editor }) => {
	const [state, setState] = useState({
		isBold: false,
		isItalic: false,
		isUnderline: false,
		isOrderedList: false,
		isUnorderedList: false,
	});
	const [isLink, setIsLink] = useState(false);
	const [currentLinkUrl, setCurrentLinkUrl] = useState('');

	const updateLinkState = useCallback(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;

		setState((prev) => ({
			...prev,
			isBold: selection.hasFormat('bold'),
			isItalic: selection.hasFormat('italic'),
			isUnderline: selection.hasFormat('underline'),
		}));

		const node = selection.anchor.getNode();
		const linkNode = $findMatchingParent(node, $isLinkNode);

		if (linkNode) {
			setIsLink(true);
			setCurrentLinkUrl(linkNode.getURL());
		} else {
			setIsLink(false);
			setCurrentLinkUrl('');
		}

		const listNode = $getNearestNodeOfType(node, ListNode);

		if (listNode) {
			const listType = listNode.getListType();
			setState((prev) => ({
				...prev,
				isOrderedList: listType === 'number',
				isUnorderedList: listType === 'bullet',
			}));
		} else {
			setState((prev) => ({
				...prev,
				isOrderedList: false,
				isUnorderedList: false,
			}));
		}
	}, []);

	useEffect(() => {
		const unregisterSelectionChange = editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				editor.getEditorState().read(() => {
					updateLinkState();
				});
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);

		return () => {
			unregisterSelectionChange();
		};
	}, [editor, updateLinkState]);

	return {
		state,
		isLink,
		currentLinkUrl,
		setCurrentLinkUrl,
	};
};

export default useFloatingMenu;
