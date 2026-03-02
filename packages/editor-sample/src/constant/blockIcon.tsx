import React from 'react';

import {
  AlignLeft,
  CircleUser,
  Columns,
  FileCode,
  Heading,
  Image,
  Layout,
  Minus,
  MousePointerClick,
  SeparatorHorizontal,
  Type,
} from 'lucide-react';

const BLOCK_ICON_MAPPING: Record<string, JSX.Element> = {
  Heading: <Heading className="h-3.5 w-3.5" />,
  Text: <AlignLeft className="h-3.5 w-3.5" />,
  Button: <MousePointerClick className="h-3.5 w-3.5" />,
  Image: <Image className="h-3.5 w-3.5" />,
  Avatar: <CircleUser className="h-3.5 w-3.5" />,
  Divider: <Minus className="h-3.5 w-3.5" />,
  Spacer: <SeparatorHorizontal className="h-3.5 w-3.5" />,
  Html: <FileCode className="h-3.5 w-3.5" />,
  Container: <Layout className="h-3.5 w-3.5" />,
  ColumnsContainer: <Columns className="h-3.5 w-3.5" />,
  Columns: <Columns className="h-3.5 w-3.5" />,
  Rte: <Type className="h-3.5 w-3.5" />,
  'Rich Text': <Type className="h-3.5 w-3.5" />,
};

export default BLOCK_ICON_MAPPING;
