import React from 'react';

export default function QuickShortcuts({ setActiveView }) {
  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-warm)' }}>
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Quick Shortcuts
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Direct cashier navigation hooks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Members */}
        <button
          onClick={() => setActiveView('members')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          className="quick-nav-btn"
        >
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(57, 113, 184, 0.08)', color: 'var(--brand-primary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Members</span>
        </button>

        {/* Memberships */}
        <button
          onClick={() => setActiveView('memberships')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          className="quick-nav-btn"
        >
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(230, 161, 0, 0.08)', color: 'var(--accent-warm)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Memberships</span>
        </button>

        {/* Gym Plans */}
        <button
          onClick={() => setActiveView('plans')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          className="quick-nav-btn"
        >
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(75, 190, 4, 0.08)', color: '#4bbe04' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Gym Plans</span>
        </button>

        {/* Ledger */}
        <button
          onClick={() => setActiveView('payments')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
          className="quick-nav-btn"
        >
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.08)', color: 'var(--color-error)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Ledger</span>
        </button>
      </div>
    </div>
  );
}
