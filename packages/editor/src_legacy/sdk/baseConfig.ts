import { serverConfig } from 'oute-ds-utils';

const MAIL_BASE_URL = serverConfig.EMAIL_TEMPLATE_SERVER;

const getToken = () => {
	return window['accessToken'];
};
const getMailSDKConfig = () => {
	return {
		url: MAIL_BASE_URL,
		token: getToken(),
		enable_encoding: ['PROD'].includes(
			process.env.REACT_APP_NODE_ENV || ''
		),
	};
};

export default getMailSDKConfig;
