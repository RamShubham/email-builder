import { z } from 'zod';

import { ReaderBlockSchema } from './Reader/core';

export { default as renderToStaticMarkup } from './renderers/renderToStaticMarkup';

export {
	ReaderBlockSchema,
	// TReaderBlock,
	//
	ReaderDocumentSchema,
	// TReaderDocument,
	//
	ReaderBlock,
	// TReaderBlockProps,
	//
	// TReaderProps,
	default as Reader,
} from './Reader/core';

export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;
export type TReaderDocument = Record<string, TReaderBlock>;
export type TReaderBlockProps = { id: string };

export type TReaderProps = {
	document: Record<string, z.infer<typeof ReaderBlockSchema>>;
	rootBlockId: string;
};
