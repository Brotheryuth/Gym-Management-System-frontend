import React, { useEffect } from 'react';

/**
 * Reusable Overlay Modal popup component.
 * @param {object} props
 * @param {boolean} props.isOpen - Is modal displayed
 * @param {string} props.title - Title header
 * @param {React.ReactNode} props.children - Main container
 * @param {function} props.onClose - Close action
 * @param {boolean} [props.closeOnBackdrop=true] - Backdrop click closes modal
 */
export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  closeOnBackdrop = true,
  maxWidth = '520px'
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
          animation: fade-in 0.2s ease-out;
        }
        
        .modal-surface {
          background-color: var(--bg-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          max-width: ${maxWidth};
          width: 100%;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        
        .modal-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .modal-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }
        
        .modal-close-btn:hover {
          background-color: var(--bg-canvas);
          color: var(--text-primary);
        }
        
        .modal-body {
          padding: 18px 20px;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div className="modal-surface">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
