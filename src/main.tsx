import './lib/api-interceptor';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// Mitigate benign Vite HMR WebSocket errors from showing overlays on preview
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const reasonStr = String(reason || '');
    if (
      reasonStr.toLowerCase().includes('websocket') ||
      reasonStr.toLowerCase().includes('ws://') ||
      reasonStr.toLowerCase().includes('wss://') ||
      (reason instanceof Error && (
        reason.message?.toLowerCase().includes('websocket')
      ))
    ) {
      event.preventDefault();
      console.info('Suppressed benign HMR WebSocket rejection:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (
      message.toLowerCase().includes('websocket') ||
      message.toLowerCase().includes('ws://') ||
      message.toLowerCase().includes('wss://')
    ) {
      event.preventDefault();
      event.stopPropagation();
      console.info('Suppressed benign WebSocket error:', message);
    }
  }, true);

  // Fallback direct window.onerror hook
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = String(message || '');
    if (
      msgStr.toLowerCase().includes('websocket') ||
      msgStr.toLowerCase().includes('ws://') ||
      msgStr.toLowerCase().includes('wss://')
    ) {
      console.info('Suppressed benign error via window.onerror:', msgStr);
      return true;
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
