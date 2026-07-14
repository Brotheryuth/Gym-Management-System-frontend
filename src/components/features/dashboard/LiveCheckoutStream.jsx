import React from 'react';

export default function LiveCheckoutStream({
  recentPaidTransactions = [],
  getMemberName
}) {
  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)' }}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Live Checkout Stream
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Real-time stream of latest successfully processed transactions.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recentPaidTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No recent completed checkouts recorded today.
          </div>
        ) : (
          recentPaidTransactions.map((tx) => {
            const dateVal = new Date(tx.paymentDate || tx.createAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={tx.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--bg-canvas)',
                transition: 'var(--transition-smooth)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: tx.method === 'KHQR' ? 'rgba(57, 113, 184, 0.1)' : 'rgba(230, 161, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tx.method === 'KHQR' ? 'var(--brand-primary)' : 'var(--accent-warm)',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}>
                    {tx.method === 'KHQR' ? 'QR' : 'CA'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {getMemberName(tx)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      via {tx.method} • {dateVal}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>
                    +${Number(tx.finalAmount).toFixed(2)}
                  </span>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#16a34a'
                  }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
