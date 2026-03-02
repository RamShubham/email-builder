import DOMPurify from 'dompurify';
import React, {
	CSSProperties,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { z } from 'zod';

import {
	ALLOWED_ATTR,
	ALLOWED_TAGS,
	FORBID_ATTR,
	FORBID_TAGS,
} from './constant/purify';

const FONT_FAMILY_SCHEMA = z
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
	])
	.nullable()
	.optional();

function getFontFamily(fontFamily: z.infer<typeof FONT_FAMILY_SCHEMA>) {
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
	}
	return undefined;
}

const COLOR_SCHEMA = z
	.string()
	.regex(/^#[0-9a-fA-F]{6}$/)
	.nullable()
	.optional();

const PADDING_SCHEMA = z
	.object({
		top: z.number(),
		bottom: z.number(),
		right: z.number(),
		left: z.number(),
	})
	.optional()
	.nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
	padding
		? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
		: undefined;

// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ALLOWED_TAGS,
		ALLOWED_ATTR: ALLOWED_ATTR,

		// Allow data attributes for testing and custom functionality
		ALLOW_DATA_ATTR: true,
		FORBID_TAGS: FORBID_TAGS,
		FORBID_ATTR: FORBID_ATTR,
		// Sanitize CSS in style attributes
		SANITIZE_DOM: true,
		ALLOW_UNKNOWN_PROTOCOLS: false,
	});
};

export const HtmlPropsSchema = z.object({
	style: z
		.object({
			color: COLOR_SCHEMA,
			backgroundColor: COLOR_SCHEMA,
			fontFamily: FONT_FAMILY_SCHEMA,
			fontSize: z.number().min(0).optional().nullable(),
			textAlign: z
				.enum(['left', 'right', 'center'])
				.optional()
				.nullable(),
			padding: PADDING_SCHEMA,
		})
		.optional()
		.nullable(),
	props: z
		.object({
			contents: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	isHtmlPanel: z.boolean().optional().nullable().default(false),
});

export type HtmlProps = z.infer<typeof HtmlPropsSchema>;

export function Html({ style, props, isHtmlPanel }: HtmlProps) {
	const children = props?.contents;

	const [sanitizedChildren, setSanitizedChildren] = useState<string | null>(
		() => {
			const sanitizedHtml = sanitizeHtml(children || '');
			return sanitizedHtml;
		}
	);

	const shadowHostRef = useRef<HTMLDivElement>(null);
	const shadowRootRef = useRef<ShadowRoot | null>(null);

	const cssStyle: CSSProperties = useMemo(
		() => ({
			color: style?.color ?? undefined,
			backgroundColor: style?.backgroundColor ?? undefined,
			fontFamily: getFontFamily(style?.fontFamily),
			fontSize: style?.fontSize ? `${style?.fontSize}px` : undefined,
			textAlign: style?.textAlign ?? undefined,
			padding: getPadding(style?.padding),
		}),
		[
			style?.color,
			style?.backgroundColor,
			style?.fontFamily,
			style?.fontSize,
			style?.textAlign,
			style?.padding,
		]
	);

	useEffect(() => {
		if (!shadowHostRef.current || !children) return;

		// Create shadow root if it doesn't exist
		if (!shadowRootRef.current) {
			shadowRootRef.current = shadowHostRef.current.attachShadow({
				mode: 'open',
			});
		}

		// Clear previous content
		shadowRootRef.current.innerHTML = '';

		// Create a container div with the same styles as the host
		const container = document.createElement('div');
		container.setAttribute('data-testid', 'html-block');

		container.style.cssText = Object.entries(cssStyle)
			.filter(([, value]) => value !== undefined)
			.map(
				([key, value]) =>
					`${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`
			)
			.join('; ');

		// Set the HTML content (sanitized for security)
		const sanitizedHtml = sanitizeHtml(children || '');
		container.innerHTML = sanitizedHtml;
		setSanitizedChildren(sanitizedHtml);

		// Append to shadow root
		shadowRootRef.current.appendChild(container);
	}, [children, cssStyle]);

	if (!children) {
		return <div style={cssStyle} data-testid="html-block" />;
	}

	return isHtmlPanel ? (
		<div
			style={cssStyle}
			data-testid="html-block"
			dangerouslySetInnerHTML={{ __html: sanitizedChildren }}
		/>
	) : (
		<div
			ref={shadowHostRef}
			style={
				{
					// Reset styles on the host since they're now applied in shadow DOM
					// all: 'unset',
					// display: 'block',
				}
			}
		/>
	);
}
