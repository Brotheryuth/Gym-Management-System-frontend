import React from 'react';
import Button from '../../ui/Button';

export default function HeroBanners({
  setActiveView,
  khqrSum = 0,
  cashSum = 0,
  cardSum = 0
}) {
  return (
    <div className="purity-grid-2-3">
      {/* Left Welcome Hero */}
      <div className="purity-card purity-hero-left">
        <div className="purity-hero-content">
          <span style={{ color: 'var(--accent-blue)' }}>Gym Management System</span>
          <h3 style={{ color: 'var(--text-primary)' }}>Cashier Command Center</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Process entries, track real-time payments, and activate memberships from one unified interface.
          </p>
        </div>
        <Button
          onClick={() => setActiveView('register')}
          style={{ width: 'auto', minWidth: '180px', alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '12px' }}
        >
          Register Member
        </Button>
        <div className="purity-hero-badge">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.9 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
      </div>

      {/* Right Glassmorphism Gateway Card */}
      <div className="purity-card purity-hero-right">
        <div className="purity-hero-content">
          <span style={{ color: 'var(--brand-vanilla)' }}>Gateway Performance</span>
          <h3 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Active Payment Methods</h3>
          <p style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)', color: '#ffffff' }}>
            Breakdown of successful transaction volume across your payment networks.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px', background: 'rgba(52, 59, 27, 0.75)', padding: '16px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--brand-vanilla)', fontWeight: 600 }}>KHQR Scan</div>
            <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>${khqrSum.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--brand-vanilla)', fontWeight: 600 }}>Cash Payments</div>
            <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>${cashSum.toFixed(2)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--brand-vanilla)', fontWeight: 600 }}>Credit Card</div>
            <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>${cardSum.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
