// @ts-ignore
import ReactPixel from 'react-facebook-pixel';

export const initFbPixel = () => {
	if (process.env.REACT_APP_NODE_ENV !== 'PROD') {
		return;
	}

	ReactPixel.init(process.env.REACT_APP_META_PIXEL_ID || '');
};

