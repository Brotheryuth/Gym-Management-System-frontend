import React from 'react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmModal Component
 * Single Responsibility: Renders a clean visual confirmation dialog UI for destructive actions
 * (e.g., deleting members/plans or cancelling memberships) instead of native browser alerts/confirms.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Modal close/cancel handler
 * @param {function} props.onConfirm - Action confirmation callback
 * @param {string} [props.title='Confirm Action'] - Title of the modal
 * @param {string} [props.message='Are you sure you want to proceed?'] - Main prompt message
 * @param {string} [props.itemName] - Name/ID of item being deleted or cancelled
 * @param {string} [props.confirmText='Confirm'] - Label for confirm action button
 * @param {string} [props.cancelText='Cancel'] - Label for cancel button
 * @param {'danger' | 'warning' | 'primary'} [props.variant='danger'] - Button and icon variant
 * @param {boolean} [props.isLoading=false] - Loading indicator for async actions
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  itemName,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: isDanger ? '#fef2f2' : '#fffbe6',
            color: isDanger ? '#ef4444' : '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: isDanger ? '1.5px solid #fecaca' : '1.5px solid #fde68a',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 600, lineHeight: 1.4 }}>
          {message}
        </p>

        {itemName && (
          <div style={{
            backgroundColor: 'var(--bg-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--brand-primary)',
            margin: '12px 0 20px',
            wordBreak: 'break-word',
          }}>
            "{itemName}"
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            loading={isLoading}
            style={{ flex: 1 }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
