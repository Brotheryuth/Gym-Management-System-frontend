import React, { useState } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

export default function MembershipManagement({
  recentMembers = [],
  onPayPending,
  onCancelMembership,
  cashier,
  onShowAdminWarning
}) {
  const [search, setSearch] = useState('');

  // 1. Calculate stats from memberships list
  const activeCount = recentMembers.filter(m => m.status === 'ACTIVE').length;
  const pendingCount = recentMembers.filter(m => m.status === 'PENDING').length;
  const otherCount = recentMembers.length - activeCount - pendingCount;

  // 2. Filter memberships list
  const filtered = recentMembers.filter(m => {
    const term = search.toLowerCase();
    return (
      (m.fullName && m.fullName.toLowerCase().includes(term)) ||
      (m.planName && m.planName.toLowerCase().includes(term)) ||
      (m.memberID && m.memberID.toLowerCase().includes(term))
    );
  });

  const handleCancel = (membershipID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    onCancelMembership(membershipID);
  };

  return (
    <div className="dashboard-overview-container">
      {/* 1. Stats row */}
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Active Memberships</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: '#4bbe04' }}>{activeCount}</span>
            </div>
          </div>
          <div className="purity-metric-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Pending Payments</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: '#e6a100' }}>{pendingCount}</span>
            </div>
          </div>
          <div className="purity-metric-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Suspended / Expired</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: 'var(--text-muted)' }}>{otherCount}</span>
            </div>
          </div>
          <div className="purity-metric-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main data Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Member Subscriptions Ledger
          </h3>
          <div style={{ width: '300px' }}>
            <InputField
              placeholder="Search by member or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Gym Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No membership records found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id || m.memberID}>
                    <td style={{ fontWeight: 'bold' }}>{m.fullName}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        backgroundColor: 'var(--brand-vanilla-light)',
                        border: '1px solid var(--brand-vanilla-border)',
                        color: 'var(--text-primary)',
                        fontWeight: 600
                      }}>
                        {m.planName}
                      </span>
                    </td>
                    <td>{m.startDate || 'N/A'}</td>
                    <td>{m.endDate || 'N/A'}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-round)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: 
                          m.status === 'ACTIVE' ? 'rgba(75, 190, 4, 0.15)' : 
                          m.status === 'PENDING' ? 'rgba(230, 161, 0, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                        color: 
                          m.status === 'ACTIVE' ? '#2e7d32' : 
                          m.status === 'PENDING' ? '#b27a00' : 'var(--color-error)'
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {m.status === 'PENDING' && (
                          <Button
                            variant="secondary"
                            onClick={() => onPayPending(m)}
                            style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto' }}
                          >
                            Pay Pending
                          </Button>
                        )}
                        {m.status === 'ACTIVE' && (
                          <Button
                            variant="ghost"
                            onClick={() => handleCancel(m.id || m.memberID)}
                            style={{
                              minHeight: '32px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              width: 'auto',
                              color: 'var(--color-error)',
                              border: '1.5px solid transparent'
                            }}
                          >
                            Cancel Sub
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
