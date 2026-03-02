import { RtePropsSchema, RteReader } from 'block-rte';
import React, { createContext, useContext } from 'react';
import { z } from 'zod';

import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import {
	buildBlockComponent,
	buildBlockConfigurationDictionary,
	buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';

import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ColumnsContainerReader from '../blocks/ColumnsContainer/ColumnsContainerReader';
import { ContainerPropsSchema } from '../blocks/Container/ContainerPropsSchema';
import ContainerReader from '../blocks/Container/ContainerReader';
import { EmailLayoutPropsSchema } from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EmailLayoutReader from '../blocks/EmailLayout/EmailLayoutReader';

const ReaderContext = createContext<TReaderDocument>({});

function useReaderDocument() {
	return useContext(ReaderContext);
}

const READER_DICTIONARY = buildBlockConfigurationDictionary({
	ColumnsContainer: {
		schema: ColumnsContainerPropsSchema,
		Component: ColumnsContainerReader,
	},
	Container: {
		schema: ContainerPropsSchema,
		Component: ContainerReader,
	},
	EmailLayout: {
		schema: EmailLayoutPropsSchema,
		Component: EmailLayoutReader,
	},
	Avatar: {
		schema: AvatarPropsSchema,
		Component: Avatar,
	},
	Button: {
		schema: ButtonPropsSchema,
		Component: Button,
	},
	Divider: {
		schema: DividerPropsSchema,
		Component: Divider,
	},
	Heading: {
		schema: HeadingPropsSchema,
		Component: Heading,
	},
	Html: {
		schema: HtmlPropsSchema,
		Component: Html,
	},
	Image: {
		schema: ImagePropsSchema,
		Component: Image,
	},
	Spacer: {
		schema: SpacerPropsSchema,
		Component: Spacer,
	},
	Text: {
		schema: TextPropsSchema,
		Component: Text,
	},
	Rte: {
		schema: RtePropsSchema,
		Component: RteReader,
	},
});

export const ReaderBlockSchema =
	buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

export type TReaderBlockProps = { id: string; isHtmlPanel?: boolean };
export function ReaderBlock({ id, isHtmlPanel = false }: TReaderBlockProps) {
	const document = useReaderDocument();

	return <BaseReaderBlock {...document[id]} isHtmlPanel={isHtmlPanel} />;
}

export type TReaderProps = {
	document: Record<string, z.infer<typeof ReaderBlockSchema>>;
	rootBlockId: string;
	isHtmlPanel?: boolean;
};
export default function Reader({
	document,
	rootBlockId,
	isHtmlPanel,
}: TReaderProps) {
	return (
		<ReaderContext.Provider value={document}>
			<ReaderBlock id={rootBlockId} isHtmlPanel={isHtmlPanel} />
		</ReaderContext.Provider>
	);
}
