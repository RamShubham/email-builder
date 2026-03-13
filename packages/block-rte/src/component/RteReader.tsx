import React from 'react';
import DOMPurify from 'dompurify';

import { getRteStyles } from '../utils/getRteStyles';

const ALLOWED_TAGS = [
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'p', 'div', 'span', 'br', 'hr',
	'strong', 'em', 'u', 's', 'b', 'i', 'mark',
	'ul', 'ol', 'li',
	'a', 'img',
	'blockquote', 'pre', 'code',
	'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const ALLOWED_ATTR = [
	'href', 'target', 'rel', 'title', 'alt',
	'src', 'class', 'id', 'style',
	'width', 'height', 'colspan', 'rowspan',
];

const FORBID_ATTR = [
	'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
];

function sanitize(html: string): string {
	if (typeof window === 'undefined') return html;
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
		FORBID_ATTR,
		FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'button', 'style'],
		ALLOW_DATA_ATTR: false,
	});
}

function RteReader({ props, style }) {
	return (
		<div style={getRteStyles(style)}>
			<div dangerouslySetInnerHTML={{ __html: sanitize(props.html ?? '') }} />
		</div>
	);
}

export default RteReader;
