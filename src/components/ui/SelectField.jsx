import React from 'react';

/**
 * Reusable SelectField dropdown component.
 * @param {object} props
 * @param {string} props.label - Dropdown label
 * @param {Array} props.options - Option objects [{ value, label }] or strings
 * @param {string} [props.error] - Validation error
 * @param {string} [props.id] - Element ID
 * @param {string} [props.className] - Wrapper class
 * @param {string} [props.placeholder] - Empty option text
 */
export default function SelectField({
  label,
  options = [],
  error,
  id,
  className = '',
  placeholder,
  ...props
}) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={selectId} className="form-label">
        {label}
      </label>
      <select
        id={selectId}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%2364748b\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const isObj = typeof opt === 'object';
          const val = isObj ? opt.value : opt;
          const text = isObj ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
