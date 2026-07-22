import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function ReceiptCard({
  receiptData,
  planDetails,
  onReset
}) {
  const handlePrint = () => {
    alert(`Printing Receipt to cash register thermal printer...\n\nTransaction: ${receiptData.paymentID}\nMember: ${receiptData.memberName}\nTotal: $${receiptData.finalAmount.toFixed(2)}`);
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

  return (
    <Card className="receipt-ticket">
      <div className="receipt-header">
        <div className="receipt-success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 2px' }}>
          Registration Complete
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
          Membership activated successfully
        </p>
      </div>

      <div className="receipt-details-list">
        <div className="receipt-details-row">
          <span className="label">Transaction Code</span>
          <span className="val">{receiptData.paymentID}</span>
        </div>

        <div className="receipt-details-row">
          <span className="label">Registered Member</span>
          <span className="val">{receiptData.memberName}</span>
        </div>

        <div className="receipt-details-row">
          <span className="label">Active Gym Plan</span>
          <span className="val">{planDetails ? planDetails.planName : 'Gym Plan'}</span>
        </div>

        <div className="receipt-details-row">
          <span className="label">Gateway Platform</span>
          <span className="val">{receiptData.paymentMethod}</span>
        </div>

        <div className="receipt-details-row">
          <span className="label">Membership Validity</span>
          <span className="val" style={{ color: 'var(--accent-blue)' }}>
            Until {getExpiryDate()}
          </span>
        </div>

        <div className="receipt-details-row" style={{ borderTop: '1px dotted var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
          <span className="label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount Paid</span>
          <span className="val" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-blue)' }}>
            ${receiptData.finalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
        
        <Button onClick={onReset}>
          Register Another Member
        </Button>
      </div>
    </Card>
  );
}
