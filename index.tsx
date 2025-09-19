
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Vercel Analytics will be auto-injected by Vercel if enabled in project settings.
// Manual injection (inject()) is often not needed.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);