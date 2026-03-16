export const initGoogleAds = () => {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	const tagId = process.env.REACT_APP_GOOGLE_ADS_TAG_ID;
	if (!tagId || tagId === 'here goes your value') {
		return;
	}

	if (typeof window === 'undefined' || window.gtag) {
		return;
	}

	const script1 = document.createElement('script');
	script1.async = true;
	script1.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
	document.head.appendChild(script1);

	window.dataLayer = window.dataLayer || [];
	function gtag(...args: any[]) {
		window.dataLayer!.push(args);
	}
	window.gtag = gtag;
	gtag('js', new Date());
	gtag('config', tagId);

};

