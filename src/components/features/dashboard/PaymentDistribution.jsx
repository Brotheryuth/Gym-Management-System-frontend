import React from 'react';

export default function PaymentDistribution({
  khqrSum = 0,
  cashSum = 0,
  cardSum = 0,
  khqrPct = 0,
  cashPct = 0,
  cardPct = 0
}) {
  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)' }}>
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          Payment Distribution
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Share of successful payments today.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* KHQR */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>KHQR Scan</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${khqrSum.toFixed(2)} ({khqrPct}%)</span>
          </div>
          <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${khqrPct}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* CASH */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Cash</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${cashSum.toFixed(2)} ({cashPct}%)</span>
          </div>
          <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${cashPct}%`, height: '100%', background: 'var(--accent-warm)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* CARD */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Credit Card</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${cardSum.toFixed(2)} ({cardPct}%)</span>
          </div>
          <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${cardPct}%`, height: '100%', background: '#4bbe04', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
