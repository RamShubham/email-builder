
import ReactPixel from 'react-facebook-pixel';

export const initFbPixel = () => {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	ReactPixel.init(process.env.REACT_APP_META_PIXEL_ID || '');
};

