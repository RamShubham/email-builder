import React from 'react';

import {
	AccountCircleOutlined,
	Crop32Outlined,
	FormatColorTextOutlined,
	HMobiledataOutlined,
	HorizontalRuleOutlined,
	HtmlOutlined,
	ImageOutlined,
	LibraryAddOutlined,
	NotesOutlined,
	SmartButtonOutlined,
	ViewColumnOutlined,
} from '@mui/icons-material';

const BLOCK_ICON_MAPPING = {
	Heading: <HMobiledataOutlined />,
	Text: <NotesOutlined />,
	Button: <SmartButtonOutlined />,
	Image: <ImageOutlined />,
	Avatar: <AccountCircleOutlined />,
	Divider: <HorizontalRuleOutlined />,
	Spacer: <Crop32Outlined />,
	Html: <HtmlOutlined />,
	Container: <LibraryAddOutlined />,
	ColumnsContainer: <ViewColumnOutlined />,
	Columns: <ViewColumnOutlined />, // added because label mapping is used in block button overlay
	Rte: <FormatColorTextOutlined />,
	'Rich Text': <FormatColorTextOutlined />,
};

export default BLOCK_ICON_MAPPING;
