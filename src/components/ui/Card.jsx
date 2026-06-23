import React from 'react';

/**
 * Reusable Card component with tactile depth / neumorphic shadow.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Extra css classes
 * @param {boolean} [props.hoverLift=false] - Whether the card lifts slightly on hover
 * @param {boolean} [props.noPadding=false] - Remove card padding
 * @param {function} [props.onClick] - Click handler
 */
export default function Card({ 
  children, 
  className = '', 
  hoverLift = false, 
  noPadding = false, 
  onClick,
  ...props 
}) {
  const cardStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: noPadding ? '0' : '24px',
    boxShadow: 'var(--shadow-tactile)',
    transition: 'var(--transition-smooth)',
    cursor: onClick ? 'pointer' : 'default',
  };

  const hoverClass = hoverLift ? 'tactile-card-lift' : '';

  const { style: customStyle, ...restProps } = props;
  const combinedStyles = { ...cardStyle, ...customStyle };

  // Apply visual lift on hover via custom inline-triggered transitions or CSS selectors
  return (
    <div 
      className={`tactile-card ${hoverClass} ${className}`}
      style={combinedStyles}
      onClick={onClick}
      {...restProps}
    >
      {/* We can define a hover style trigger in css for .tactile-card-lift */}
      <style>{`
        .tactile-card-lift {
          transition: var(--transition-smooth);
        }
        .tactile-card-lift:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-tactile-lift) !important;
          border-color: var(--accent-orange-border) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
