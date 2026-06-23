import React from 'react';

/**
 * Reusable Fitts's Law compliant Button component.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.type='button'] - Button type
 * @param {string} [props.variant='primary'] - 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {boolean} [props.loading=false] - Shows loading spinner and disables double-clicks
 * @param {boolean} [props.disabled=false] - Disables interaction
 * @param {string} [props.className] - Custom classes
 * @param {function} [props.onClick] - Click handler
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const getStyles = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-family)',
      fontSize: '15px',
      fontWeight: '700',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 24px',
      minHeight: '48px', // Fitts's Law target acquisition limit
      cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-smooth)',
      outline: 'none',
      border: 'none',
      width: '100%',
      position: 'relative',
      opacity: (disabled || loading) ? '0.6' : '1',
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: 'var(--accent-orange)',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(255, 87, 34, 0.2)',
      };
    }

    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: 'var(--color-border)',
        color: 'var(--text-primary)',
      };
    }

    if (variant === 'danger') {
      return {
        ...base,
        backgroundColor: 'transparent',
        border: '1.5px solid var(--color-error)',
        color: 'var(--color-error)',
      };
    }

    if (variant === 'ghost') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: 'var(--text-muted)',
      };
    }

    return base;
  };

  const currentStyles = getStyles();

  const { style: customStyle, ...restProps } = props;
  const combinedStyles = { ...currentStyles, ...customStyle };

  return (
    <button
      type={type}
      style={combinedStyles}
      disabled={disabled || loading}
      onClick={onClick}
      className={`app-btn btn-${variant} ${className}`}
      {...restProps}
    >
      <style>{`
        .btn-primary:not(:disabled):hover {
          background-color: var(--accent-orange-hover) !important;
          box-shadow: 0 6px 16px rgba(255, 87, 34, 0.3) !important;
          transform: translateY(-1px);
        }
        .btn-primary:not(:disabled):active {
          transform: translateY(0);
        }
        .btn-secondary:not(:disabled):hover {
          background-color: #cbd5e1 !important;
        }
        .btn-danger:not(:disabled):hover {
          background-color: var(--color-error-bg) !important;
        }
        .btn-ghost:not(:disabled):hover {
          background-color: var(--bg-canvas) !important;
          color: var(--text-primary) !important;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }
        .btn-danger .spinner {
          border: 2px solid rgba(239, 68, 68, 0.2);
          border-top-color: var(--color-error);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {loading && <div className="spinner" />}
      <span>{loading ? 'Processing...' : children}</span>
    </button>
  );
}
