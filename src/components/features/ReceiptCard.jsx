import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function ReceiptCard({
  receiptData,
  planDetails,
  onReset
}) {
  const handlePrint = () => {
    window.print();
  };

  const getExpiryDate = () => {
    try {
      const start = new Date(receiptData.startDate || new Date());
      const months = planDetails ? Number(planDetails.duration) || 1 : 1;
      start.setMonth(start.getMonth() + months);
      return start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const formattedDate = new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const basePrice = planDetails ? Number(planDetails.planPrice) : (receiptData.finalAmount || 0);
  const discountPct = Number(receiptData.discount) || 0;
  const discountAmount = (basePrice * discountPct) / 100;

  return (
    <Card className="receipt-ticket printable-receipt-area">
      <div className="receipt-header" style={{ textAlign: 'center', borderBottom: '2px dashed var(--color-border)', paddingBottom: '14px', marginBottom: '14px' }}>
        <div style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          GYM MANAGEMENT SYSTEM
        </div>
        <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
          Official Payment Receipt & Membership Pass
        </p>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontFamily: 'monospace' }}>
          ISSUED: {formattedDate}
        </span>
      </div>

      <div className="receipt-details-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
        <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: 'var(--text-muted)' }}>Receipt Ref</span>
          <strong className="val">#{receiptData.paymentID}</strong>
        </div>

        <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: 'var(--text-muted)' }}>Member Name</span>
          <strong className="val">{receiptData.memberName}</strong>
        </div>

        {(receiptData.memberID || receiptData.id) && (
          <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="label" style={{ color: 'var(--text-muted)' }}>Member ID</span>
            <span className="val">#{receiptData.memberID || receiptData.id}</span>
          </div>
        )}

        <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: 'var(--text-muted)' }}>Membership Plan</span>
          <span className="val" style={{ fontWeight: 700 }}>{planDetails ? planDetails.planName : 'Gym Plan'}</span>
        </div>

        <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: 'var(--text-muted)' }}>Payment Gateway</span>
          <span className="val" style={{ fontWeight: 600 }}>{receiptData.paymentMethod}</span>
        </div>

        <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: 'var(--text-muted)' }}>Validity Period</span>
          <span className="val" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
            Until {getExpiryDate()}
          </span>
        </div>

        <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '10px', marginTop: '4px' }}>
          {discountPct > 0 && (
            <>
              <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                <span className="label" style={{ color: 'var(--text-muted)' }}>Subtotal Price</span>
                <span className="val">${basePrice.toFixed(2)}</span>
              </div>
              <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'var(--color-success)' }}>
                <span className="label">Discount ({discountPct}%)</span>
                <span className="val">-${discountAmount.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className="receipt-details-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label" style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>Total Amount Paid</span>
            <span className="val" style={{ fontSize: '20px', fontWeight: 900, color: 'var(--brand-primary)' }}>
              ${Number(receiptData.finalAmount || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Turnstile Access / Member Gateway Pass */}
      <div style={{ textAlign: 'center', margin: '16px 0 12px', borderTop: '1px dashed var(--color-border)', paddingTop: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', display: 'block', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
          GATEWAY ACCESS • MEMBER ID: #{receiptData.memberID || receiptData.id || 'N/A'}
        </span>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Thank you! Turnstile gate access granted via Member ID.
        </p>
      </div>

      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
        <Button onClick={handlePrint} variant="secondary">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Thermal Receipt
          </span>
        </Button>
        
        {onReset && (
          <Button onClick={onReset}>
            Done & Next
          </Button>
        )}
      </div>
    </Card>
  );
}
