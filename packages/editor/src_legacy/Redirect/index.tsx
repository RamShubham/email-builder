import { useEffect } from 'react';

function Redirect(props) {
	const { url } = props;

	useEffect(() => {
		window.location.href = url;
	}, [url]);

	return <div style={{ padding: '0.312rem' }}>Redirecting...</div>;
}

export default Redirect;
