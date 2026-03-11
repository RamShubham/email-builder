import React from 'react';

import { useGlobalLoader } from '../../documents/editor/EditorContext';

function GlobalLoader() {
  const isLoading = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
}

export default GlobalLoader;
