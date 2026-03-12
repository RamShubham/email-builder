import { CSSProperties } from 'react';
import { z } from 'zod';

import { PADDING_SCHEMA, STYLE_SCHEMA, getFontFamily } from '..';

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
	padding
		? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
		: undefined;

export const getRteStyles = (style: z.infer<typeof STYLE_SCHEMA>) => {
	const rteStyle: CSSProperties = {
		padding: getPadding(style?.padding),
		backgroundColor: style?.backgroundColor ?? undefined,
		color: style?.color ?? undefined,
		fontFamily: getFontFamily(style?.fontFamily),
		textAlign: style?.textAlign ?? undefined,
		borderRadius: style?.borderRadius ?? undefined,
	};

	return rteStyle;
};
