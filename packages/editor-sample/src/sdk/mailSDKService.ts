import Email from 'oute-services-mail-sdk';

import getMailSDKConfig from './baseConfig';

type TError = {
	result: {
		message: string;
	};
};

const getEmailInstance = () => {
	return new Email(getMailSDKConfig());
};

const isErrorWithResult = (error: unknown): error is TError => {
	return typeof error === 'object' && error !== null && 'result' in error;
};

const mailSDKServices = {
	save: async (payload = {}) => {
		try {
			const response = await getEmailInstance().save(payload);
			return response;
		} catch (error: unknown) {
			throw new Error(
				isErrorWithResult(error) ? error.result.message : String(error)
			);
		}
	},
	findOne: async (payload = {}) => {
		try {
			const response = await getEmailInstance().findOne(payload);
			return response;
		} catch (error: unknown) {
			throw new Error(
				isErrorWithResult(error) ? error.result.message : String(error)
			);
		}
	},
};

export default mailSDKServices;
