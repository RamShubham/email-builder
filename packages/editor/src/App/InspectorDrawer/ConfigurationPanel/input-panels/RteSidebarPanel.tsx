import { RtePropsSchema } from 'block-rte';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

function RteSidebarPanel({ data, setData }) {
	const updateData = (d: unknown) => {
		const res = RtePropsSchema.safeParse(d);
		console.log('res >>', res, d);
		if (res.success) {
			setData(res.data);
		}
	};

	return (
		<BaseSidebarPanel title="RTE block">
			<MultiStylePropertyPanel
				names={[
					'borderRadius',
					'color',
					'backgroundColor',
					'fontFamily',
					'textAlign',
					'padding',
				]}
				value={data.style}
				onChange={(style) => updateData({ ...data, style })}
			/>
		</BaseSidebarPanel>
	);
}

export default RteSidebarPanel;
