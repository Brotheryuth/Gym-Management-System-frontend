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
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={inputId} className="form-label">
        <span>{label}</span>
        {rightLabel && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{rightLabel}</span>}
      </label>
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
