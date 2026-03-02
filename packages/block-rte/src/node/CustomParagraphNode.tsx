import {
	$getSelection,
	LexicalEditor,
	LexicalNode,
	ParagraphNode,
	SerializedParagraphNode,
} from 'lexical';

import { $setBlocksType } from '@lexical/selection';

export class CustomParagraphNode extends ParagraphNode {
	static getType(): string {
		return 'custom-paragraph';
	}

	static clone(node: CustomParagraphNode): CustomParagraphNode {
		return new CustomParagraphNode(node.__key);
	}

	createDOM(): HTMLElement {
		const dom = document.createElement('div');
		dom.style.margin = '0';
		return dom;
	}

	updateDOM(): boolean {
		return false;
	}

	static importJSON(
		serializedNode: SerializedParagraphNode
	): CustomParagraphNode {
		const node = $createCustomParagraphNode();
		node.setFormat(serializedNode.format);
		node.setIndent(serializedNode.indent);
		node.setDirection(serializedNode.direction);
		return node;
	}

	exportJSON(): SerializedParagraphNode {
		return {
			...super.exportJSON(),
			type: 'custom-paragraph',
			version: 1,
		};
	}
}

export function $createCustomParagraphNode(): CustomParagraphNode {
	return new CustomParagraphNode();
}

export function $isCustomParagraphNode(
	node: LexicalNode | null | undefined
): node is CustomParagraphNode {
	return node instanceof CustomParagraphNode;
}

export const formatParagraph = (editor: LexicalEditor) => {
	editor.update(() => {
		const selection = $getSelection();
		$setBlocksType(selection, () => $createCustomParagraphNode());
	});
};
