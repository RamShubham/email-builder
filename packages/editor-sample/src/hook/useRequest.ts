import axios, { AxiosError, AxiosInstance } from 'axios';
import { makeUseAxios } from 'axios-hooks';

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

const instance: AxiosInstance = axios.create({
	baseURL: BACKEND_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.interceptors.request.use(
	(config: any) => {
		const headers = {
			...(config.headers || {}),
			token: config.headers?.token || window.accessToken,
		};

		return {
			...config,
			headers,
		};
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Check if the error is due to cancellation
		if (axios.isCancel(error)) {
			// Return a resolved promise or null to prevent it from propagating further
			return Promise.reject({ isCancel: true });
		}
		// For other errors, propagate the error
		return Promise.reject(error);
	}
);

const useRequest = makeUseAxios({
	axios: instance,
});

export default useRequest;
