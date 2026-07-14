import React from 'react';

/**
 * Reusable InputField component supporting live validation states.
 * @param {object} props
 * @param {string} props.label - Input label
 * @param {string} [props.error] - Validation error message to display
 * @param {string} [props.id] - Element ID
 * @param {string} [props.className] - Wrapper class
 * @param {string} [props.type='text'] - Input HTML type
 * @param {string} [props.rightLabel] - Text to show on the right side of the label
 */
export default function InputField({
  label,
  error,
  id,
  className = '',
  type = 'text',
  rightLabel,
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : `input-search-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {rightLabel && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{rightLabel}</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
