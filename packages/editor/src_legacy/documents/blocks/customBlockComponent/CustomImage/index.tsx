import ODSButton from 'oute-ds-button';
import { z } from 'zod';

import { Box, CircularProgress } from '@mui/material';
import { Image, ImageProps } from '@usewaypoint/block-image';

import useGenerateImg from './useGenerateImg';

// URL validation schema using Zod
const urlSchema = z.string().url();

function CustomImage(props: ImageProps) {
	const { url, alt, height } = props?.props || {};
	const { loading, generateImage } = useGenerateImg();

	// Check if URL is valid using Zod schema
	const isUrlValid = url ? urlSchema.safeParse(url)?.success : false;

	// Show generate image CTA if URL is invalid and alt text is present
	if (!isUrlValid && alt) {
		return (
			<Box
				sx={{
					width: '100%',
					height: height,
					background: '#efefef',
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '10px',
					boxSizing: 'border-box',
				}}
				data-testid="image-block"
			>
				{loading ? (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							background: 'rgba(0, 0, 0, 0.08)',
							zIndex: 10,
							backdropFilter: 'blur(4px)',
						}}
					>
						<CircularProgress />
					</div>
				) : null}

				<img alt={alt} src="" />

				<ODSButton
					variant="black"
					size="sm"
					onClick={() => generateImage({ imageDescription: alt })}
				>
					Generate Image
				</ODSButton>
			</Box>
		);
	}

	return <Image {...props} />;
}

export default CustomImage;
