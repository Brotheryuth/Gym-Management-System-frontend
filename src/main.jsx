import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept fetch calls globally to prepend target API URL in production
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = typeof input === 'string' ? input : input?.url;
  
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? '' : 'https://gym-management-system-kt2c.onrender.com';
    const targetUrl = `${baseUrl}${url}`;

    if (typeof input === 'string') {
      input = targetUrl;
    } else if (input instanceof Request) {
      input = new Request(targetUrl, input);
    }
  }
  return originalFetch.call(this, input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
