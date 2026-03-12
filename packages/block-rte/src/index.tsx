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

export const FONT_FAMILY_SCHEMA = z
	.enum([
		'MODERN_SANS',
		'BOOK_SANS',
		'ORGANIC_SANS',
		'GEOMETRIC_SANS',
		'HEAVY_SANS',
		'ROUNDED_SANS',
		'MODERN_SERIF',
		'BOOK_SERIF',
		'MONOSPACE',
		'inherit',
	])
	.nullable()
	.optional();

export function getFontFamily(fontFamily: z.infer<typeof FONT_FAMILY_SCHEMA>) {
	switch (fontFamily) {
		case 'MODERN_SANS':
			return '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';
		case 'BOOK_SANS':
			return 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif';
		case 'ORGANIC_SANS':
			return 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif';
		case 'GEOMETRIC_SANS':
			return 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif';
		case 'HEAVY_SANS':
			return 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';
		case 'ROUNDED_SANS':
			return 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif';
		case 'MODERN_SERIF':
			return 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif';
		case 'BOOK_SERIF':
			return '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif';
		case 'MONOSPACE':
			return '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace';
		case 'inherit':
			return 'inherit';
		default:
			return undefined;
	}
}

export const STYLE_SCHEMA = z.object({
	padding: PADDING_SCHEMA,
	backgroundColor: COLOR_SCHEMA,
	color: COLOR_SCHEMA,
	fontFamily: FONT_FAMILY_SCHEMA,
	textAlign: z
		.enum(['left', 'center', 'right'])
		.optional()
		.nullable(),
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
