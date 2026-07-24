import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatErrorMessage } from '../../utils/errorFormatter';
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
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter, statusFilter, sortBy]);

  // Combine full payments list with recent mock payments if empty
  const allPayments = payments.length > 0 ? payments : [
    { paymentID: 101, memberName: 'Sokha Chan', amount: 35.00, method: 'KHQR', status: 'PAID', paymentDate: '2026-07-22' },
    { paymentID: 102, memberName: 'Bopha Devi', amount: 90.00, method: 'CREDITCARD', status: 'PAID', paymentDate: '2026-07-22' },
    { paymentID: 103, memberName: 'Vireak Both', amount: 300.00, method: 'BYCASH', status: 'PAID', paymentDate: '2026-07-21' }
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const isPaymentPaid = (p) => {
    if (!p) return false;
    const st = String(p.status || '').toUpperCase();
    return st === 'PAID' || st === 'COMPLETED' || st === 'SUCCESS';
  };
  const getPaymentAmount = (p) => {
    if (!p) return 0;
    const val = p.finalAmount !== undefined ? p.finalAmount : (p.baseAmount !== undefined ? p.baseAmount : p.amount);
    return Number(val) || 0;
  };

  const paidPayments = allPayments.filter(isPaymentPaid);
  const todayPayments = paidPayments.filter(p => {
    const pDate = p.paymentDate || p.createAt;
    return pDate && String(pDate).startsWith(todayStr);
  });

  const todayRevenue = todayPayments.reduce((sum, p) => sum + getPaymentAmount(p), 0);
  const totalRevenue = paidPayments.reduce((sum, p) => sum + getPaymentAmount(p), 0);
  const pendingCount = allPayments.filter(p => p.status === 'PENDING').length;

  // 2. Filter & Sort payments list
  const filtered = allPayments
    .filter(p => {
      const term = search.toLowerCase();
      const matchesSearch = (
        (p.memberName && p.memberName.toLowerCase().includes(term)) ||
        (p.id && String(p.id).toLowerCase().includes(term)) ||
        (p.membershipID && String(p.membershipID).toLowerCase().includes(term))
      );
      const matchesMethod = methodFilter === 'ALL' || (p.method || 'KHQR').toUpperCase() === methodFilter;
      const matchesStatus = statusFilter === 'ALL' || (p.status || 'PAID').toUpperCase() === statusFilter;
      return matchesSearch && matchesMethod && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'AMOUNT_HIGH') return (b.finalAmount || b.amount || 0) - (a.finalAmount || a.amount || 0);
      if (sortBy === 'AMOUNT_LOW') return (a.finalAmount || a.amount || 0) - (b.finalAmount || b.amount || 0);
      if (sortBy === 'NEWEST') return new Date(b.paymentDate || b.createAt) - new Date(a.paymentDate || a.createAt);
      if (sortBy === 'OLDEST') return new Date(a.paymentDate || a.createAt) - new Date(b.paymentDate || b.createAt);
      return 0;
    });

  const pageSize = 6;
  const paginatedPayments = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRefund = (paymentID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    if (window.confirm('Are you sure you want to refund this payment transaction?')) {
      onRefundPayment(paymentID)
        .then(() => toast.success('Transaction refunded successfully.'))
        .catch(err => {
          toast.error(formatErrorMessage(err));
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
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

        {/* 1-Click Vertical Filter Rows */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="filter-chip-container" style={{ margin: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '120px' }}>
              Payment Method:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'KHQR', label: 'KHQR Scan' },
              { id: 'BYCASH', label: 'Cash' },
              { id: 'CREDITCARD', label: 'Credit / Debit Card' }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                className={`filter-chip-pill ${methodFilter === m.id ? 'active' : ''}`}
                onClick={() => { setMethodFilter(m.id); setCurrentPage(1); }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="filter-chip-container" style={{ margin: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '120px' }}>
              Status:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PAID', label: 'Paid / Completed' },
              { id: 'PENDING', label: 'Pending' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                className={`filter-chip-pill ${statusFilter === s.id ? 'active' : ''}`}
                onClick={() => { setStatusFilter(s.id); setCurrentPage(1); }}
              >
                {s.label}
              </button>
            ))}
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
                      <td>{p.memberName || getMemberName(p.membershipID)}</td>
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
