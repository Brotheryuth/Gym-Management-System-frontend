import React from 'react';

/**
 * Reusable Skeleton loader for placeholder loading states.
 * @param {object} props
 * @param {string} [props.width='100%'] - Width css property
 * @param {string} [props.height='20px'] - Height css property
 * @param {string} [props.borderRadius='4px'] - Border radius css property
 * @param {string} [props.className] - Extra classes
 * @param {object} [props.style] - Inline overrides
 */
export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
  style = {},
  ...props
}) {
  const defaultStyle = {
    width,
    height,
    borderRadius,
    ...style,
  };

  return (
    <div
      className={`skeleton-bar ${className}`}
      style={defaultStyle}
      {...props}
    />
  );
}
