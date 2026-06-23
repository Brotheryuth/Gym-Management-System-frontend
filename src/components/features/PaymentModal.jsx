import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

export default function PaymentModal({
  isOpen,
  onClose,
  paymentID,
  paymentMethod,
  totalAmount,
  memberName,
  onConfirm,
  onMethodChange,
  isLoading,
  error
}) {
  const [cashReceived, setCashReceived] = useState('');
  const [cashChange, setCashChange] = useState(0);
  const [cashError, setCashError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCashReceived('');
      setCashChange(0);
      setCashError('');
    }
  }, [isOpen, paymentMethod]);

  const handleCashChange = (val) => {
    setCashReceived(val);
    const received = parseFloat(val) || 0;
    if (received < totalAmount) {
      setCashChange(0);
      if (val !== '') {
        setCashError(`Received amount must be at least $${totalAmount.toFixed(2)}`);
      } else {
        setCashError('');
      }
    } else {
      setCashError('');
      setCashChange(received - totalAmount);
    }
  };

  const handleConfirmClick = () => {
    if (paymentMethod === 'BYCASH') {
      const received = parseFloat(cashReceived) || 0;
      if (received < totalAmount) {
        setCashError(`Please collect at least $${totalAmount.toFixed(2)} physical cash.`);
        return;
      }
    }
    onConfirm();
  };

  const gateways = [
    {
      id: 'KHQR',
      title: 'KHQR Scan',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: 'BYCASH',
      title: 'Physical Cash',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      )
    },
    {
      id: 'CREDITCARD',
      title: 'POS Card',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    }
  ];

  return (
    <Modal isOpen={isOpen} title="Interactive Terminal Processing" onClose={onClose}>
      <div className="payment-modal-content">
        <div className="payment-badge-header">
          Ref ID: {paymentID}
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
          Processing payment for <strong>{memberName}</strong>
        </p>
        
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 20px' }}>
          ${totalAmount.toFixed(2)}
        </h2>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1.5px solid var(--color-error)',
            color: 'var(--color-error)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            width: '100%'
          }}>
            Terminal Warning: {error}
          </div>
        )}

        {paymentMethod === 'KHQR' && (
          <div>
            <div className="qr-code-box">
              <svg width="140" height="140" viewBox="0 0 100 100" fill="none" stroke="var(--text-primary)" strokeWidth="4">
                <rect x="5" y="5" width="25" height="25" fill="none" />
                <rect x="10" y="10" width="15" height="15" fill="var(--text-primary)" />
                <rect x="70" y="5" width="25" height="25" fill="none" />
                <rect x="75" y="10" width="15" height="15" fill="var(--text-primary)" />
                <rect x="5" y="70" width="25" height="25" fill="none" />
                <rect x="10" y="75" width="15" height="15" fill="var(--text-primary)" />
                <path d="M40 10h10v10H40zm0 20h10v10H40zm0 20h10v10H40zm20-20h10v10H60zm0 20h10v10H60zm20 20h10v10H80zm0 20h10v10H80z" fill="var(--text-primary)" />
              </svg>
              <div className="qr-logo-overlay">KH</div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Instruct member to scan this QR code using their banking application
            </p>
          </div>
        )}

        {paymentMethod === 'BYCASH' && (
          <div className="cash-received-calc">
            <InputField
              label="Cash Received From Member ($)"
              type="number"
              placeholder="e.g. 50"
              value={cashReceived}
              onChange={(e) => handleCashChange(e.target.value)}
              error={cashError}
              autoFocus
            />
            
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Physical Change Due
              </span>
              <div className="cash-change-display">
                ${cashChange.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'CREDITCARD' && (
          <div className="card-terminal-display">
            <div className="terminal-status-ring">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2.5">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Awaiting reader interaction. Insert or tap payment card on active terminal.
            </p>
          </div>
        )}

        <Button
          type="button"
          onClick={handleConfirmClick}
          loading={isLoading}
        >
          Confirm Payment Successful
        </Button>

        {/* Resilient Payment switcher inside modal */}
        <div className="payment-selector-dropdown-wrapper">
          <label className="form-label" style={{ marginBottom: '8px' }}>Gateway Recovery (Switch payment method)</label>
          <div className="gateway-grid">
            {gateways.map((g) => (
              <div
                key={g.id}
                className={`gateway-card ${paymentMethod === g.id ? 'active' : ''}`}
                onClick={() => !isLoading && onMethodChange(g.id)}
                style={{ padding: '10px', gap: '6px' }}
              >
                {g.icon}
                <span className="gateway-card-title" style={{ fontSize: '11px' }}>{g.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
