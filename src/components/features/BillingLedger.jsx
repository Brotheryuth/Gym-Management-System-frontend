import React, { useState } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';

export default function BillingLedger({
  payments = [],
  recentMembers = [],
  onRefundPayment,
  cashier,
  onShowAdminWarning
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculate stats
  const paidPayments = payments.filter(p => p.status === 'PAID');
  
  const todayPayments = paidPayments.filter(p => {
    const pDate = p.paymentDate || p.createAt;
    return pDate && String(pDate).startsWith(todayStr);
  });
  
  const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.finalAmount), 0);
  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.finalAmount), 0);

  // 2. Filter list
  const filtered = payments.filter(p => {
    const term = search.toLowerCase();
    
    // Find member name
    const member = recentMembers.find(m => String(m.id) === String(p.membershipID) || String(m.memberID) === String(p.membershipID));
    const memberName = member ? member.fullName : 'Walk-in Customer';

    return (
      String(p.id).toLowerCase().includes(term) ||
      memberName.toLowerCase().includes(term) ||
      (p.method && p.method.toLowerCase().includes(term)) ||
      (p.status && p.status.toLowerCase().includes(term))
    );
  });

  const pageSize = 20;
  const paginatedPayments = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRefund = (paymentID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    if (window.confirm('Are you sure you want to refund this payment transaction?')) {
      onRefundPayment(paymentID).catch(err => {
        alert('Error: ' + err.message);
      });
    }
  };

  const getMemberName = (membershipID) => {
    const member = recentMembers.find(m => String(m.id) === String(membershipID) || String(m.memberID) === String(membershipID));
    return member ? member.fullName : 'Walk-in Customer';
  };

  return (
    <div className="dashboard-overview-container">
      {/* 1. Stats overview grid */}
      <div className="purity-grid-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Today's Money</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">${todayRevenue.toFixed(2)}</span>
            </div>
          </div>
          <div className="purity-metric-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Today's Receipts</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">{todayPayments.length}</span>
            </div>
          </div>
          <div className="purity-metric-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Total Revenue</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">${totalRevenue.toFixed(2)}</span>
            </div>
          </div>
          <div className="purity-metric-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <path d="M12 16h.01"></path>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Total Receipts</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">{paidPayments.length}</span>
            </div>
          </div>
          <div className="purity-metric-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main data Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Billing Transactions Ledger
          </h3>
          <div style={{ width: '300px' }}>
            <InputField
              placeholder="Search by ID, member, method..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ margin: 0 }}
            />
          </div>
        </div>

        <div className="dashboard-table-container">
          <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Client Name</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Date / Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No payment transactions found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p, idx) => {
                  const dateVal = p.paymentDate || p.createAt;
                  const formattedDate = dateVal 
                    ? new Date(dateVal).toLocaleString()
                    : 'N/A';
                  
                  return (
                    <tr key={p.id ? `p-${p.id}-${idx}` : `pay-idx-${idx}`}>
                      <td style={{ fontWeight: 'bold' }}>#{p.id}</td>
                      <td>{getMemberName(p.membershipID)}</td>
                      <td>${Number(p.baseAmount || p.finalAmount).toFixed(2)}</td>
                      <td>{p.discount || 0}%</td>
                      <td style={{ fontWeight: 'bold', color: p.status === 'PAID' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        ${Number(p.finalAmount).toFixed(2)}
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'var(--accent-secondary-light)',
                          color: 'var(--accent-secondary)',
                          border: '1px solid var(--accent-secondary-border)'
                        }}>
                          {p.method || 'KHQR'}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-round)',
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: 
                            p.status === 'PAID' ? 'var(--color-success-bg)' : 
                            p.status === 'REFUNDED' ? 'var(--color-error-bg)' : 'var(--color-pending-bg)',
                          color: 
                            p.status === 'PAID' ? 'var(--color-success)' : 
                            p.status === 'REFUNDED' ? 'var(--color-error)' : 'var(--color-pending)',
                          border: `1px solid ${
                            p.status === 'PAID' ? 'rgba(22, 163, 74, 0.25)' : 
                            p.status === 'REFUNDED' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(217, 119, 6, 0.25)'
                          }`
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px' }}>{formattedDate}</td>
                      <td>
                        {p.status === 'PAID' && (
                          <Button
                            variant="ghost"
                            onClick={() => handleRefund(p.id)}
                            style={{
                              minHeight: '30px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              width: 'auto',
                              color: 'var(--color-error)',
                              border: '1.5px solid transparent'
                            }}
                          >
                            Refund
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="payments"
        />
      </Card>
    </div>
  );
}
