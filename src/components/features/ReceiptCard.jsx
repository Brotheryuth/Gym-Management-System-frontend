import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function ReceiptCard({
  receiptData,
  planDetails,
  onReset
}) {
  const handlePrint = () => {
    alert(`🖨️ Printing Receipt to cash register thermal printer...\n\nTransaction: ${receiptData.paymentID}\nMember: ${receiptData.memberName}\nTotal: $${receiptData.finalAmount.toFixed(2)}`);
  };

  // Compute expiration date based on startDate + duration
  const getExpiryDate = () => {
    try {
      const start = new Date(receiptData.startDate || new Date());
      const days = planDetails ? planDetails.duration : 30;
      start.setDate(start.getDate() + days);
      return start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <Card className="receipt-ticket">
      <div className="receipt-header">
        <div className="receipt-success-icon">✓</div>
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
          <span className="val" style={{ color: 'var(--accent-orange)' }}>
            Until {getExpiryDate()}
          </span>
        </div>

        <div className="receipt-details-row" style={{ borderTop: '1px dotted var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
          <span className="label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount Paid</span>
          <span className="val" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-orange)' }}>
            ${receiptData.finalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button onClick={handlePrint} variant="secondary">
          🖨️ Print Thermal Receipt
        </Button>
        
        <Button onClick={onReset}>
          Register Another Member
        </Button>
      </div>
    </Card>
  );
}
