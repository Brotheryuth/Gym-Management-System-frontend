import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const METHOD_OPTIONS = [
  { value: 'KHQR', label: 'KHQR (Mobile Scan)' },
  { value: 'BYCASH', label: 'BYCASH (Physical Cash)' },
  { value: 'CREDITCARD', label: 'CREDITCARD (POS Terminal)' }
];

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

  // Auto-fill cash received or reset states when modal visibility shifts
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
            ⚠️ Terminal Error: {error}
          </div>
        )}

        {/* Dynamic Payment Method Layout */}
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
              Ask member to scan this QR via Bakong or local banking app
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
              Waiting for member to tap or insert card in terminal...
            </p>
          </div>
        )}

        {/* Fitts's Law Button */}
        <Button
          type="button"
          onClick={handleConfirmClick}
          loading={isLoading}
        >
          Confirm Payment Successful
        </Button>

        {/* Resilient Payment switcher inside modal */}
        <div className="payment-selector-dropdown-wrapper">
          <SelectField
            label="Gateway Recovery (Switch payment method)"
            options={METHOD_OPTIONS}
            value={paymentMethod}
            onChange={(e) => onMethodChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
