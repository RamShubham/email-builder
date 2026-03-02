import { z } from 'zod';

export { default as buildBlockComponent } from './builders/buildBlockComponent';
export { default as buildBlockConfigurationSchema } from './builders/buildBlockConfigurationSchema';
export { default as buildBlockConfigurationDictionary } from './builders/buildBlockConfigurationDictionary';

// export { BlockConfiguration, DocumentBlocksDictionary } from './utils';

// importBaseZodDictionary,  { BlockConfiguration, DocumentBlocksDictionary } from './utils';

// export { BlockConfiguration, DocumentBlocksDictionary };

export type BaseZodDictionary = { [name: string]: z.AnyZodObject };

export type DocumentBlocksDictionary<T extends BaseZodDictionary> = {
	[K in keyof T]: {
		schema: T[K];
		Component: (props: z.infer<T[K]>) => JSX.Element;
	};
};

export type BlockConfiguration<T extends BaseZodDictionary> = {
	[TType in keyof T]: {
		type: TType;
		data: z.infer<T[TType]>;
	};
}[keyof T];
