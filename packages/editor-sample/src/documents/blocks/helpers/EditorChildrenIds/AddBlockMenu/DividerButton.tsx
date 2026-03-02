import { AddOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

type Props = {
	onClick: () => void;
};
export default function DividerButton({ onClick }: Props) {
	return (
		<IconButton
			size="small"
			sx={{
				p: 0.12,
				position: 'absolute',
				top: '-12px',
				left: '50%',
				transform: 'translateX(-10px)',
				bgcolor: 'brand.blue',
				color: 'primary.contrastText',
				zIndex: 'fab',
				'&:hover, &:active, &:focus': {
					bgcolor: 'brand.blue',
					color: 'primary.contrastText',
				},
			}}
			onClick={(ev) => {
				ev.stopPropagation();
				onClick();
			}}
			data-testid="add-block-button"
		>
			<AddOutlined />
		</IconButton>
	);
}
