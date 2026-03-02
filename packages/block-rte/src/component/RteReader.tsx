import React from 'react';

import { getRteStyles } from '../utils/getRteStyles';

function RteReader({ props, style }) {
	return (
		<div style={getRteStyles(style)}>
			<div dangerouslySetInnerHTML={{ __html: props.html }} />
		</div>
	);
}

export default RteReader;
