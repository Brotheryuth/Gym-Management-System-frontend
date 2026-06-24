import React from 'react';

export default function SubscriptionsTable({
  recentMembers = [],
  onPayPending,
  onEditMember,
  onDeleteMember
}) {
  return (
    <div className="purity-card">
      <div className="purity-table-header">
        <div>
          <h4 className="purity-table-title" style={{ color: 'var(--text-primary)' }}>Recent Gym Subscriptions</h4>
          <div className="purity-table-subtitle" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{recentMembers.length} active</span> registrations in total
          </div>
        </div>
      </div>

      <div className="dashboard-table-container" style={{ margin: '0', boxShadow: 'none', border: 'none' }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '0', color: 'var(--text-muted)' }}>Member</th>
              <th style={{ color: 'var(--text-muted)' }}>Plan & Value</th>
              <th style={{ color: 'var(--text-muted)' }}>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '0', color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentMembers.map((m, index) => {
              const initials = m.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              const isPending = m.status === 'PENDING';

              return (
                <tr key={m.id}>
                  <td style={{ paddingLeft: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="purity-avatar-group">
                        <div className="purity-avatar" style={{ backgroundColor: index % 2 === 0 ? 'var(--accent-blue)' : 'var(--brand-tea-green)', color: index % 2 === 0 ? '#ffffff' : 'var(--text-primary)' }}>
                          {initials}
                        </div>
                      </div>
                      <div>
                        <div className="member-name-cell" style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>
                          {m.fullName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {m.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{m.planName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Active Base</div>
                  </td>
                  <td>
                    <span className="member-status-tag" style={{ margin: '0' }}>{m.status}</span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '0' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {isPending && (
                        <button
                          onClick={() => onPayPending(m)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--color-active-green-bg)',
                            color: 'var(--color-active-green)',
                            border: '1px solid var(--color-active-green-border)',
                            outline: 'none'
                          }}
                        >
                          Pay
                        </button>
                      )}
                      <button
                        onClick={() => onEditMember(m)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: 'var(--accent-blue-light)',
                          color: 'var(--accent-blue)',
                          border: '1px solid var(--accent-blue-border)',
                          outline: 'none'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteMember(m.memberID)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: 'var(--color-error-bg)',
                          color: 'var(--color-error)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          outline: 'none'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
