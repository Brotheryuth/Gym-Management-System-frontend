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
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)' }}>
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          Payment Distribution
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Share of successful payments today.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* KHQR */}
        <div className="analytics-progress-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>KHQR Scan</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${khqrSum.toFixed(2)} ({khqrPct}%)</span>
          </div>
          <div className="analytics-progress-track" style={{ height: '7px', background: 'var(--progress-track-bg, #E2E8F0)', borderRadius: '4px', overflow: 'hidden' }}>
            <div className="analytics-progress-bar" style={{ width: `${khqrPct}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* CASH */}
        <div className="analytics-progress-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Cash</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${cashSum.toFixed(2)} ({cashPct}%)</span>
          </div>
          <div className="analytics-progress-track" style={{ height: '7px', background: 'var(--progress-track-bg, #E2E8F0)', borderRadius: '4px', overflow: 'hidden' }}>
            <div className="analytics-progress-bar" style={{ width: `${cashPct}%`, height: '100%', background: 'var(--accent-warm)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* CARD */}
        <div className="analytics-progress-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Credit Card</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>${cardSum.toFixed(2)} ({cardPct}%)</span>
          </div>
          <div className="analytics-progress-track" style={{ height: '7px', background: 'var(--progress-track-bg, #E2E8F0)', borderRadius: '4px', overflow: 'hidden' }}>
            <div className="analytics-progress-bar" style={{ width: `${cardPct}%`, height: '100%', background: '#4bbe04', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
