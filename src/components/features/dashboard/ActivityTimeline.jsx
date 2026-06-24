import React from 'react';

export default function ActivityTimeline({
  payments = [],
  getMemberName
}) {
  return (
    <div className="purity-card">
      <div className="purity-table-header" style={{ marginBottom: '20px' }}>
        <div>
          <h4 className="purity-table-title" style={{ color: 'var(--text-primary)' }}>Recent Payment Activity</h4>
          <div className="purity-table-subtitle" style={{ color: 'var(--text-muted)' }}>
            Timeline logs directly from gateway receipts
          </div>
        </div>
      </div>

      <div className="purity-timeline">
        {payments.filter(p => p.status === 'PAID').slice(0, 5).map((p, idx) => {
          const name = getMemberName(p.membershipID);
          const formattedDate = p.paymentDate 
            ? new Date(p.paymentDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
            : p.createAt 
            ? new Date(p.createAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
            : 'Recent';

          let dotClass = 'info';
          if (p.method === 'KHQR') dotClass = 'success';
          else if (p.method === 'BYCASH' || p.method === 'CASH') dotClass = 'warning';
          else if (p.method === 'CREDITCARD') dotClass = 'danger';

          return (
            <div key={p.id || idx} className="purity-timeline-item">
              <div className={`purity-timeline-icon ${dotClass}`}>
                {p.method === 'KHQR' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : p.method === 'CREDITCARD' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                )}
              </div>
              <div className="purity-timeline-details">
                <span className="purity-timeline-title" style={{ color: 'var(--text-primary)' }}>
                  <strong>{name}</strong> paid <strong>${p.finalAmount.toFixed(2)}</strong> via {p.method}
                </span>
                <span className="purity-timeline-time">{formattedDate}</span>
              </div>
            </div>
          );
        })}
        
        {payments.filter(p => p.status === 'PAID').length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '14px' }}>
            No transaction logs processed on this shift yet.
          </div>
        )}
      </div>
    </div>
  );
}
