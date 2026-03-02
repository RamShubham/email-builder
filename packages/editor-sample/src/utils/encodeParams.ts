const encodeParams = (data) => {
	return btoa(JSON.stringify(data));
};

export default encodeParams;
