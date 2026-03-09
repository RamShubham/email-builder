import { z } from 'zod';

import { ColumnsContainerPropsSchema as BaseColumnsContainerPropsSchema } from '@usewaypoint/block-columns-container';

const BasePropsShape = BaseColumnsContainerPropsSchema.shape.props
	.unwrap()
	.unwrap().shape;

const ColumnsContainerPropsSchema = z.object({
	style: BaseColumnsContainerPropsSchema.shape.style,
	props: z
		.object({
			...BasePropsShape,
			columns: z.tuple([
				z.object({ childrenIds: z.array(z.string()) }),
				z.object({ childrenIds: z.array(z.string()) }),
				z.object({ childrenIds: z.array(z.string()) }),
			]),
			url: z
				.string()
				.optional()
				.nullable()
				.refine(
					(value) => {
						if (!value) return true;

						const isUrl = z.string().url().safeParse(value).success;
						const isVariable = /^\{\{[a-zA-Z0-9_]+\}\}$/.test(value);

						return isUrl || isVariable;
					},
					{
						message:
							'Must be a valid URL or a variable like {{profile_url}}',
					}
				),
		})
		.optional()
		.nullable(),
});

export type ColumnsContainerProps = z.infer<typeof ColumnsContainerPropsSchema>;
export default ColumnsContainerPropsSchema;
