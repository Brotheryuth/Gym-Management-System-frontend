import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import qrCodeImg from '../../assets/QRcode.png';

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
      if (received < (totalAmount || 0)) {
        setCashError(`Please collect at least $${(totalAmount || 0).toFixed(2)} physical cash.`);
        return;
      }
    }
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cashier Terminal Checkout">
      <div style={{ textAlign: 'center' }}>
        
        {/* Payment Method Selector Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: 'var(--color-bg-alt)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px'
        }}>
          {[
            { id: 'KHQR', title: 'KHQR Scan' },
            { id: 'BYCASH', title: 'Physical Cash' },
            { id: 'CREDITCARD', title: 'Credit / Debit Card' }
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMethodChange(m.id)}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: paymentMethod === m.id ? 'var(--brand-primary)' : 'transparent',
                color: paymentMethod === m.id ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {m.title}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 2px' }}>
          Processing payment for <strong>{memberName}</strong>
        </p>
        
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 14px' }}>
          ${(totalAmount || 0).toFixed(2)}
        </h2>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1.5px solid var(--color-error)',
            color: 'var(--color-error)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '14px',
            width: '100%'
          }}>
            Terminal Warning: {error}
          </div>
        )}

        {paymentMethod === 'KHQR' && (
          <div>
            <div style={{ margin: '0 auto 10px', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={qrCodeImg} 
                alt="KHQR Payment Code" 
                style={{ 
                  maxWidth: '180px', 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Instruct member to scan this QR code using their banking application
            </p>
          </div>
        )}

        {paymentMethod === 'BYCASH' && (
          <div className="cash-received-calc" style={{ marginBottom: '14px' }}>
            <InputField
              label="Cash Received From Member ($)"
              type="number"
              placeholder="e.g. 50"
              value={cashReceived}
              onChange={(e) => handleCashChange(e.target.value)}
              error={cashError}
              autoFocus
            />
            
            <div style={{ marginTop: '10px' }}>
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
          <div className="card-terminal-display" style={{ marginBottom: '14px' }}>
            <div className="terminal-status-ring">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
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
      </div>
    </Modal>
  );
}
