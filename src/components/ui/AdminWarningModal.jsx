import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function AdminWarningModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      title="Access Restricted"
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Admin Permission Required</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px', lineHeight: 1.5 }}>
          This administrative operation is restricted. Please request assistance from your manager or log in with an Administrator profile to proceed.
        </p>
        <Button
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Acknowledge
        </Button>
      </div>
    </Modal>
  );
}
