import { z } from 'zod';

import Rte from './component/Rte';
import RteReader from './component/RteReader';

export const COLOR_SCHEMA = z
	.string()
	.regex(/^#[0-9a-fA-F]{6}$/)
	.nullable()
	.optional();

export const PADDING_SCHEMA = z
	.object({
		top: z.number(),
		bottom: z.number(),
		right: z.number(),
		left: z.number(),
	})
	.optional()
	.nullable();

export const STYLE_SCHEMA = z.object({
	padding: PADDING_SCHEMA,
	backgroundColor: COLOR_SCHEMA,
	borderRadius: z.number().nonnegative().optional().nullable(),
});

export const RtePropsSchema = z.object({
	props: z.object({
		content: z.any(),
		html: z.string(),
	}),
	style: STYLE_SCHEMA,
});

export type RteProps = z.infer<typeof RtePropsSchema>;

export default Rte;
export { RteReader };
