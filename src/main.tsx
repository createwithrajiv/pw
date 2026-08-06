import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Geist for everything. These entry points declare a @font-face per subset with
// a unicode-range, so the browser only downloads the latin file for this site.
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@/themes/globals.css';

import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
