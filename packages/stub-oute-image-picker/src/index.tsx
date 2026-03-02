import React from 'react';

export function ImagePicker({ onChange, hideEditButton, workspaceId }: {
  onChange?: (value: any) => void;
  hideEditButton?: boolean;
  workspaceId?: string;
}) {
  return React.createElement('div', {
    style: { padding: '16px', textAlign: 'center', color: '#666' }
  }, React.createElement('p', null, 'Image picker is not available in this environment.'));
}

export default ImagePicker;
