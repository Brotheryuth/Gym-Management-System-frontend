import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Intercept fetch calls globally to prepend target API URL in production
console.log("DEBUG: VITE_API_URL =", import.meta.env.VITE_API_URL);
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    url = `${baseUrl}${url}`;
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
