import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept fetch calls globally with automatic fallback to public backend if local returns 404
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = typeof input === 'string' ? input : input?.url;
  
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const remoteBaseUrl = 'https://gym-management-system-kt2c.onrender.com';

    if (!isLocal) {
      const targetUrl = `${remoteBaseUrl}${url}`;
      const reqInput = typeof input === 'string' ? targetUrl : new Request(targetUrl, input);
      return originalFetch.call(this, reqInput, init);
    }

    // In local dev: try local proxy first
    try {
      const localRes = await originalFetch.call(this, input, init);
      if (localRes.status !== 404) {
        return localRes;
      }
    } catch (ignored) {}

    // If local backend returns 404 or network error, fallback to live Render backend
    const fallbackUrl = `${remoteBaseUrl}${url}`;
    const fallbackInput = typeof input === 'string' ? fallbackUrl : new Request(fallbackUrl, input);
    return originalFetch.call(this, fallbackInput, init);
  }
  return originalFetch.call(this, input, init);
};

import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
