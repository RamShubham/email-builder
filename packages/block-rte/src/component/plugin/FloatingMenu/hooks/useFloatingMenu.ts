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

	const updateState = useCallback(() => {
		const selection = $getSelection();
		if (!$isRangeSelection(selection)) return;

		setState({
			isBold: selection.hasFormat('bold'),
			isItalic: selection.hasFormat('italic'),
			isUnderline: selection.hasFormat('underline'),
			isOrderedList: false,
			isUnorderedList: false,
		});

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
		}
	}, []);

	useEffect(() => {
		const unregisterSelection = editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				editor.getEditorState().read(() => {
					updateState();
				});
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);

		const unregisterUpdate = editor.registerUpdateListener(
			({ editorState }) => {
				editorState.read(() => {
					updateState();
				});
			}
		);

		return () => {
			unregisterSelection();
			unregisterUpdate();
		};
	}, [editor, updateState]);

	return {
		state,
		isLink,
		currentLinkUrl,
		setCurrentLinkUrl,
	};
};

export default useFloatingMenu;
