import BLOCK_ICON_MAPPING from '../../../../constant/blockIcon';

import styles from './styles.module.scss';

function BlockButtonOverlay({ label }: { label: string }) {
	const blockType = label.split('inspect-block-')?.[1];
	const icon = BLOCK_ICON_MAPPING[blockType];

	return (
		<div className={styles.container}>
			<div className={styles.icon_container}>{icon}</div>
			<p className={styles.text}>{blockType}</p>
		</div>
	);
}

export default BlockButtonOverlay;
