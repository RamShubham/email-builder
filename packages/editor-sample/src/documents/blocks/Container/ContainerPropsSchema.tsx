import { z } from 'zod';

import { ContainerPropsSchema as BaseContainerPropsSchema } from '@usewaypoint/block-container';

const ContainerPropsSchema = z.object({
	style: BaseContainerPropsSchema.shape.style,
	props: z
		.object({
			childrenIds: z.array(z.string()).optional().nullable(),
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

export default ContainerPropsSchema;

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
