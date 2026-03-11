const decodeParams = (base64String: any = '') => {
	try {
		return JSON.parse(atob(base64String));
	} catch (error) {
		return {};
	}
};

export default decodeParams;
