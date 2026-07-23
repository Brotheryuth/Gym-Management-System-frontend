import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="toast-container">
        <style>{`
          .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            width: calc(100vw - 40px);
            pointer-events: none;
          }

          .toast-item {
            pointer-events: auto;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 16px;
            border-radius: var(--radius-md, 14px);
            background: #FFFFFF;
            border: 1px solid var(--color-border, #E2E8F0);
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
            animation: toast-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
          }

          .toast-item.error {
            border-left: 4px solid var(--color-error, #EF4444);
          }

          .toast-item.success {
            border-left: 4px solid var(--color-success, #10B981);
          }

          .toast-item.warning {
            border-left: 4px solid var(--color-pending, #F59E0B);
          }

          .toast-item.info {
            border-left: 4px solid var(--brand-primary, #3971B8);
          }

          .toast-icon {
            flex-shrink: 0;
            margin-top: 1px;
          }

          .toast-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .toast-title {
            font-size: 13.5px;
            font-weight: 700;
            color: var(--text-primary, #0F172A);
          }

          .toast-message {
            font-size: 12.5px;
            color: var(--text-muted, #64748B);
            line-height: 1.4;
          }

          .toast-close {
            background: transparent;
            border: none;
            cursor: pointer;
            color: var(--text-muted, #94A3B8);
            padding: 2px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;
            transition: all 0.2s ease;
          }

          .toast-close:hover {
            color: var(--text-primary, #0F172A);
            background: rgba(0, 0, 0, 0.05);
          }

          @keyframes toast-slide-in {
            from {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
          }
        `}</style>

        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {/* Icon */}
            <div className="toast-icon">
              {t.type === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error, #EF4444)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              {t.type === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success, #10B981)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {t.type === 'warning' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-pending, #F59E0B)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              )}
              {t.type === 'info' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary, #3971B8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>

            {/* Content */}
            <div className="toast-content">
              <span className="toast-title">
                {t.type === 'error' && 'Action Failed'}
                {t.type === 'success' && 'Success'}
                {t.type === 'warning' && 'Attention'}
                {t.type === 'info' && 'Notice'}
              </span>
              <span className="toast-message">{t.message}</span>
            </div>

            {/* Close Button */}
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Close notification">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
