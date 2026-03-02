import { TEditorBlock } from '../documents/editor/core';

import BLOCK_ICON_MAPPING from './blockIcon';

type TButtonProps = {
	label: string;
	icon: JSX.Element;
	block: () => TEditorBlock;
};

export const BUTTONS: TButtonProps[] = [
	{
		label: 'Heading',
		icon: BLOCK_ICON_MAPPING.Heading,
		block: () => ({
			type: 'Heading',
			data: {
				props: { text: 'Hello friend' },
				template: { text: 'Hello friend' },
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Text',
		icon: BLOCK_ICON_MAPPING.Text,
		block: () => ({
			type: 'Text',
			data: {
				props: { text: 'My new text block' },
				template: { text: 'My new text block' },
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
					fontWeight: 'normal',
				},
			},
		}),
	},

	{
		label: 'Button',
		icon: BLOCK_ICON_MAPPING.Button,
		block: () => ({
			type: 'Button',
			data: {
				props: {
					text: 'Button',
					url: 'https://www.tinycommand.com/',
				},
				template: {
					text: 'Button',
					url: 'https://www.tinycommand.com/',
				},
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Image',
		icon: BLOCK_ICON_MAPPING.Image,
		block: () => ({
			type: 'Image',
			data: {
				props: {
					url: 'https://cdn-v1.tinycommand.com/1234567890/1753855606350/Image%20block%20empty%20state%20-%20black.jpg',
					alt: 'Sample product',
					contentAlignment: 'middle',
					linkHref: null,
				},
				template: {
					url: 'https://cdn-v1.tinycommand.com/1234567890/1753855606350/Image%20block%20empty%20state%20-%20black.jpg',
					alt: 'Sample product',
					contentAlignment: 'middle',
					linkHref: null,
				},
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Avatar',
		icon: BLOCK_ICON_MAPPING.Avatar,
		block: () => ({
			type: 'Avatar',
			data: {
				props: {
					imageUrl: 'https://ui-avatars.com/api/?size=128',
					shape: 'circle',
				},
				template: {
					imageUrl: 'https://ui-avatars.com/api/?size=128',
					shape: 'circle',
				},
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Divider',
		icon: BLOCK_ICON_MAPPING.Divider,
		block: () => ({
			type: 'Divider',
			data: {
				style: { padding: { top: 16, right: 0, bottom: 16, left: 0 } },
				props: {
					lineColor: '#CCCCCC',
				},
			},
		}),
	},
	{
		label: 'Spacer',
		icon: BLOCK_ICON_MAPPING.Spacer,
		block: () => ({
			type: 'Spacer',
			data: {},
		}),
	},
	{
		label: 'Html',
		icon: BLOCK_ICON_MAPPING.Html,
		block: () => ({
			type: 'Html',
			data: {
				props: { contents: '<strong>Hello world</strong>' },
				template: { contents: '<strong>Hello world</strong>' },
				style: {
					fontSize: 16,
					textAlign: null,
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Columns',
		icon: BLOCK_ICON_MAPPING.ColumnsContainer,
		block: () => ({
			type: 'ColumnsContainer',
			data: {
				props: {
					columnsGap: 16,
					columnsCount: 3,
					columns: [
						{ childrenIds: [] },
						{ childrenIds: [] },
						{ childrenIds: [] },
					],
				},
				template: {
					columnsGap: 16,
					columnsCount: 3,
					columns: [
						{ childrenIds: [] },
						{ childrenIds: [] },
						{ childrenIds: [] },
					],
				},
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Container',
		icon: BLOCK_ICON_MAPPING.Container,
		block: () => ({
			type: 'Container',
			data: {
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
			},
		}),
	},
	{
		label: 'Rich Text',
		icon: BLOCK_ICON_MAPPING.Rte,
		block: () => ({
			type: 'Rte',
			data: {
				props: {
					content: undefined,
					html: '',
				},
				style: {
					padding: { top: 16, bottom: 16, left: 24, right: 24 },
				},
				template: {},
			},
		}),
	},

	// { label: 'ProgressBar', icon: <ProgressBarOutlined />, block: () => ({}) },
	// { label: 'LoopContainer', icon: <ViewListOutlined />, block: () => ({}) },
];
