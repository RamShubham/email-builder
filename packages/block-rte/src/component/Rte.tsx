import { ParagraphNode } from 'lexical';
import React from 'react';

import { $generateHtmlFromNodes } from '@lexical/html';
// import { $generateHtmlFromNodes } from '@lexical/html';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import {
        $createCustomParagraphNode,
        CustomParagraphNode,
} from '../node/CustomParagraphNode';
import { getRteStyles } from '../utils/getRteStyles';

import FloatingMenuPlugin from './plugin/FloatingMenu';
import LinkClickPlugin from './plugin/LinkClick';
import styles from './styles.module.scss';

function onError(error) {
        console.error(error);
}

const initialConfig = {
        namespace: 'MyEditor',
        theme: {
                text: {
                        bold: styles.bold,
                        italic: styles.italic,
                        underline: styles.underline,
                },
                list: {
                        ul: 'list-disc pl-4',
                        ol: 'list-decimal pl-4',
                        listitem: 'list-item',
                },
        },
        nodes: [
                ListNode,
                ListItemNode,
                LinkNode,
                CustomParagraphNode,
                {
                        replace: ParagraphNode,
                        with: () => $createCustomParagraphNode(),
                        withKlass: CustomParagraphNode,
                },
        ],
        onError,
};

function Rte({ props, style, onChange }) {
        return (
                <div style={getRteStyles(style)}>
                        <LexicalComposer
                                initialConfig={{
                                        ...initialConfig,
                                        editorState: JSON.stringify(props.content),
                                }}
                        >
                                <div className="editor-container">
                                        <RichTextPlugin
                                                contentEditable={
                                                        <div className={styles.rte_container}>
                                                                <ContentEditable
                                                                        className={styles.content_editable}
                                                                        aria-placeholder={'Enter some text...'}
                                                                        placeholder={
                                                                                <div className={styles.placeholder}>
                                                                                        Enter some text...
                                                                                </div>
                                                                        }
                                                                />
                                                        </div>
                                                }
                                                ErrorBoundary={LexicalErrorBoundary}
                                        />
                                        <HistoryPlugin />
                                        <OnChangePlugin
                                                ignoreSelectionChange
                                                onChange={(editorState, editor) => {
                                                        editorState.read(() => {
                                                                const _raw = $generateHtmlFromNodes(
                                                                        editor,
                                                                        null
                                                                );
                                                                onChange({
                                                                        content: editorState,
                                                                        html: _raw,
                                                                });
                                                        });
                                                }}
                                        />
                                        <LinkPlugin
                                                attributes={{
                                                        rel: 'noopener noreferrer',
                                                        target: '_blank',
                                                }}
                                        />
                                        <AutoFocusPlugin />
                                        <ListPlugin />
                                        <FloatingMenuPlugin />
                                        <LinkClickPlugin />
                                </div>
                        </LexicalComposer>
                </div>
        );
}

export default Rte;
