import { RtePropsSchema } from 'block-rte';
import { z } from 'zod';

import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { ButtonPropsSchema } from '@usewaypoint/block-button';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { HeadingPropsSchema } from '@usewaypoint/block-heading';
import { HtmlPropsSchema } from '@usewaypoint/block-html';
import { ImagePropsSchema } from '@usewaypoint/block-image';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { TextPropsSchema } from '@usewaypoint/block-text';
import {
	buildBlockComponent,
	buildBlockConfigurationDictionary,
	buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';

import ColumnsContainerEditor from '../blocks/ColumnsContainer/ColumnsContainerEditor';
import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ContainerEditor from '../blocks/Container/ContainerEditor';
import ContainerPropsSchema from '../blocks/Container/ContainerPropsSchema';
import CustomImage from '../blocks/customBlockComponent/CustomImage';
import EditableButton from '../blocks/customBlockComponent/editable/EditableButton';
import EditableHeading from '../blocks/customBlockComponent/editable/EditableHeading';
import EditableHtml from '../blocks/customBlockComponent/editable/EditableHtml';
import EditableText from '../blocks/customBlockComponent/editable/EditableText';
import EmailLayoutEditor from '../blocks/EmailLayout/EmailLayoutEditor';
import EmailLayoutPropsSchema from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EditorBlockWrapper from '../blocks/helpers/block-wrappers/EditorBlockWrapper';
import RteComponent from '../blocks/RteComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EDITOR_DICTIONARY: any = buildBlockConfigurationDictionary({
	Avatar: {
		schema: AvatarPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<Avatar {...props} />
			</EditorBlockWrapper>
		),
	},
	Button: {
		schema: ButtonPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<EditableButton {...props} />
			</EditorBlockWrapper>
		),
	},
	Container: {
		schema: ContainerPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<ContainerEditor {...props} />
			</EditorBlockWrapper>
		),
	},
	ColumnsContainer: {
		schema: ColumnsContainerPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<ColumnsContainerEditor {...props} />
			</EditorBlockWrapper>
		),
	},
	Heading: {
		schema: HeadingPropsSchema,
		Component: (props) => {
			return (
				<EditorBlockWrapper>
					<EditableHeading {...props} />
				</EditorBlockWrapper>
			);
		},
	},
	Html: {
		schema: HtmlPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<EditableHtml {...props} />
			</EditorBlockWrapper>
		),
	},
	Image: {
		schema: ImagePropsSchema,
		Component: (data) => {
			const props = {
				...data,
				props: {
					...data.props,
					url: data.props?.url,
				},
			};
			return (
				<EditorBlockWrapper>
					<CustomImage {...props} />
				</EditorBlockWrapper>
			);
		},
	},
	Text: {
		schema: TextPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<EditableText {...props} />
			</EditorBlockWrapper>
		),
	},
	EmailLayout: {
		schema: EmailLayoutPropsSchema,
		Component: (p) => <EmailLayoutEditor {...p} />,
	},
	Spacer: {
		schema: SpacerPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<Spacer {...props} />
			</EditorBlockWrapper>
		),
	},
	Divider: {
		schema: DividerPropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<Divider {...props} />
			</EditorBlockWrapper>
		),
	},
	Rte: {
		schema: RtePropsSchema,
		Component: (props) => (
			<EditorBlockWrapper>
				<RteComponent {...props} />
			</EditorBlockWrapper>
		),
	},
});

export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema =
	buildBlockConfigurationSchema(EDITOR_DICTIONARY);

export const EditorBlockSchema2 = buildBlockConfigurationSchema(
	EDITOR_DICTIONARY
).transform((block) => {
	if (block.type !== 'EmailLayout' && block?.data && 'props' in block.data) {
		return {
			...block,
			data: {
				...block.data,
				template: block.data.props,
			},
		};
	}
	return block;
});

export const EditorConfigurationSchema = z.record(
	z.string(),
	EditorBlockSchema2
);

export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
