import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import React, { useEffect, useRef } from 'react';

import animationData from '../../assets/lotties/tinycommand-loading.json';

import styles from './styles.module.scss';

function GlobalLoader() {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current) {
			lottieRef.current.setSpeed(2); // This will set the animation speed to 2x
		}
	}, []);

	return (
		<div className={styles.container}>
			<Lottie
				animationData={animationData}
				loop={true}
				style={{ height: '12rem' }}
				lottieRef={lottieRef}
			/>
		</div>
	);
}

export default GlobalLoader;
