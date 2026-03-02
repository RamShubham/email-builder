import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import swapPropsAndTemplate from './swapPropsAndTemplate';

const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/i;

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateHtml(document) {
	const updateDocument = swapPropsAndTemplate(document);

	let html = renderToStaticMarkup(updateDocument, {
		rootBlockId: 'root',
	});

	Object.keys(updateDocument).forEach((blockId) => {
		const block = updateDocument[blockId];

		if (block.type === 'Container' && block.data.props?.url) {
			const url = block.data.props.url;

			const tempDoc = {
				...updateDocument,
				root: {
					type: 'EmailLayout',
					data: {
						...updateDocument.root.data,
						childrenIds: [blockId],
					},
				},
			};

			const containerHtml = renderToStaticMarkup(tempDoc, {
				rootBlockId: 'root',
			});

			const tdMatch = containerHtml.match(tdPattern);

			if (tdMatch && tdMatch[1]) {
				const tdContent = tdMatch[1].trim();

				// Escape special characters to make it regex-safe
				const escapedTdContent = escapeRegExp(tdContent);
				const tdContentPattern = new RegExp(escapedTdContent, 'g');

				// Replace exact match in the main HTML
				html = html.replace(
					tdContentPattern,
					`<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">${tdContent}</a>`
				);
			}
		}

		if (block.type === 'ColumnsContainer' && block.data.props?.url) {
			const url = block.data.props.url;

			const tempDoc = {
				...updateDocument,
				root: {
					type: 'EmailLayout',
					data: {
						...updateDocument.root.data,
						childrenIds: [blockId],
					},
				},
			};

			const columnsContainerHtml = renderToStaticMarkup(tempDoc, {
				rootBlockId: 'root',
			});

			const columnsPattern =
				/<td[^>]*>(\s*<div[^>]*>\s*<table[\s\S]*?<\/table>\s*<\/div>\s*)<\/td>/i;

			const columnsMatch = columnsContainerHtml.match(columnsPattern);

			if (columnsMatch && columnsMatch[1]) {
				const columnsContent = columnsMatch[1].trim();

				const escapedColumnsContent = escapeRegExp(columnsContent);
				const columnsContentPattern = new RegExp(
					escapedColumnsContent,
					'g'
				);

				// Replace exact match in the main HTML
				html = html.replace(
					columnsContentPattern,
					`<a href="${url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">${columnsContent}</a>`
				);
			}
		}
	});

	return html;
}

export default generateHtml;
