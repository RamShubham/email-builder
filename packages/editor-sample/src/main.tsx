import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './styles/globals.css';
import { TooltipProvider } from './components/ui/tooltip';
import AppRouter from './AppRouter';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <TooltipProvider>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  </React.StrictMode>
);
