import useRequest from '../../../../hook/useRequest';
import {
	setDocument,
	useDocument,
	useIds,
	useSelectedBlockId,
} from '../../../editor/EditorContext';

const useGenerateImg = () => {
	const document = useDocument();
	const selectedBlockId = useSelectedBlockId();

	const { workspaceId } = useIds();

	const [{ loading }, trigger] = useRequest(
		{
			method: 'post',
			url: '/api/image/generate',
		},
		{ manual: true }
	);

	const setBlock = (blockId: string, imageUrl: string) => {
		const block = document[blockId];
		setDocument({
			[blockId]: {
				...block,
				data: {
					...block.data,
					props: {
						...block.data.props,
						url: imageUrl,
					},
					template: {
						...block.data.template,
						url: imageUrl,
					},
				},
			},
		});
	};

	const setImageUrl = (imageUrl: string, alt: string) => {
		if (selectedBlockId) {
			setBlock(selectedBlockId, imageUrl);

			return;
		}

		const blocksIds = Object.keys(document);

		for (let i = 0; i < blocksIds.length; i++) {
			const blockId = blocksIds[i];
			const currentBlock = document[blockId];
			const { props } = currentBlock.data;

			if (props?.alt === alt) {
				setBlock(blockId, imageUrl);
				return;
			}
		}
	};

	const generateImage = async ({
		imageDescription,
	}: {
		imageDescription: string;
	}) => {
		try {
			const { data } = await trigger({
				data: {
					imageDescription: imageDescription,
					workspaceId,
				},
			});

			setImageUrl(data?.imageUrl, imageDescription);
		} catch (error) {
			console.log('error >>', error);
		}
	};

	return { loading, generateImage };
};

export default useGenerateImg;
