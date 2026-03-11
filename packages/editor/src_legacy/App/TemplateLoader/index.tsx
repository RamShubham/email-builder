import React, { useEffect, useState } from 'react';

import LOADING_MESSAGE from '../../constant/loadingMessage';
import { useTemplatePanelLoader } from '../../documents/editor/EditorContext';

import styles from './styles.module.scss';

function TemplatePanelLoader() {
	const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGE[0]);
	const templatePanelLoader = useTemplatePanelLoader();

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (templatePanelLoader) {
			interval = setInterval(() => {
				setLoadingMsg(
					LOADING_MESSAGE[
						Math.floor(Math.random() * LOADING_MESSAGE.length)
					]
				);
			}, 5500);
		}

		return () => clearInterval(interval);
	}, [templatePanelLoader]);

	if (!templatePanelLoader) return null;

	return (
		<div className={styles.container} data-testid="template-panel-loader">
			<div className={styles.loader_container}>
				<div className={styles.loader}></div>
				<span className={styles.loading_text}>{loadingMsg}</span>
			</div>
		</div>
	);
}

export default TemplatePanelLoader;
