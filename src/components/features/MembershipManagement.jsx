import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatErrorMessage } from '../../utils/errorFormatter';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import MembershipFormModal from './MembershipFormModal';
import ConfirmModal from '../ui/ConfirmModal';

export default function MembershipManagement({
  recentMembers = [],
  members = [],
  plans = [],
  onCreateMembership,
  onPayPending,
  onCancelMembership,
  onViewProfile,
  cashier,
  onShowAdminWarning,
  initialPlanFilter = 'ALL'
}) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState(initialPlanFilter);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [cancellingItem, setCancellingItem] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = (sub) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    setCancellingItem(sub);
  };

  const handleConfirmCancelMembership = async () => {
    if (!cancellingItem) return;
    setIsCancelling(true);
    try {
      await onCancelMembership(cancellingItem.id || cancellingItem.membershipID);
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setIsCancelling(false);
      setCancellingItem(null);
    }
  };

  useEffect(() => {
    if (initialPlanFilter) {
      setPlanFilter(initialPlanFilter);
    }
  }, [initialPlanFilter]);
  
  // 1. Calculate stats from memberships list
  const activeCount = recentMembers.filter(m => m.status === 'ACTIVE').length;
  const pendingCount = recentMembers.filter(m => m.status === 'PENDING').length;
  const otherCount = recentMembers.length - activeCount - pendingCount;

  const getDaysRemaining = (endDateStr) => {
    if (!endDateStr || endDateStr === 'N/A') return null;
    const end = new Date(endDateStr);
    const now = new Date();
    if (isNaN(end.getTime())) return null;
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // 2. Filter & Sort memberships list
  const filtered = recentMembers
    .filter(m => {
      const term = search.toLowerCase();
      const matchesSearch = (
        (m.fullName && m.fullName.toLowerCase().includes(term)) ||
        (m.planName && m.planName.toLowerCase().includes(term)) ||
        (m.memberID && String(m.memberID).toLowerCase().includes(term))
      );
      const matchesGender = genderFilter === 'ALL' || m.gender === genderFilter;
      const matchesPlan = planFilter === 'ALL' || (
        planFilter === 'EXPIRING_SOON'
          ? (m.status === 'ACTIVE' && (() => {
              const days = getDaysRemaining(m.endDate);
              return days !== null && days >= 0 && days <= 7;
            })())
          : m.planName === planFilter
      );
      const matchesStatus = statusFilter === 'ALL' || String(m.status).toUpperCase() === statusFilter;
      return matchesSearch && matchesGender && matchesPlan && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'PENDING_FIRST') {
        const isPenA = a.status === 'PENDING' ? 0 : 1;
        const isPenB = b.status === 'PENDING' ? 0 : 1;
        return isPenA - isPenB;
      }
      if (sortBy === 'EXPIRING_SOON_FIRST') {
        const daysA = getDaysRemaining(a.endDate) ?? 999;
        const daysB = getDaysRemaining(b.endDate) ?? 999;
        return daysA - daysB;
      }
      if (sortBy === 'NAME_ASC') return (a.fullName || '').localeCompare(b.fullName || '');
      if (sortBy === 'NAME_DESC') return (b.fullName || '').localeCompare(a.fullName || '');
      if (sortBy === 'GENDER') return (a.gender || '').localeCompare(b.gender || '');
      if (sortBy === 'PLAN') return (a.planName || '').localeCompare(b.planName || '');
      if (sortBy === 'STATUS') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, genderFilter, planFilter, statusFilter, sortBy]);

  const pageSize = 6;
  const paginatedSubscriptions = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddMembershipClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      await onCreateMembership(payload);
      setIsModalOpen(false);
      toast.success('Membership subscription created.');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <div 
          className="purity-card purity-metric-card" 
          onClick={() => { setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', border: statusFilter === 'PENDING' ? '2px solid #e6a100' : '1px solid var(--color-border)', transition: 'all 0.2s ease' }}
          title="Click to filter by Pending Payment"
        >
          <div className="purity-metric-info">
            <h5>Pending Cash/KHQR</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: '#e6a100' }}>{pendingCount}</span>
            </div>
          </div>
          <div className="purity-metric-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Expired / Suspended</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: 'var(--color-error)' }}>{otherCount}</span>
            </div>
          </div>
          <div className="purity-metric-icon red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. List Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Active Gym Subscriptions
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '240px' }}>
              <InputField
                placeholder="Search member or plan..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="mb-0"
                style={{ margin: 0 }}
              />
            </div>

            <Button
              onClick={handleAddMembershipClick}
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
            >
              + New Subscription
            </Button>
          </div>
        </div>

        {/* 1-Click Vertical Filter Rows */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="filter-chip-container" style={{ margin: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '60px' }}>
              Status:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'ACTIVE', label: 'Active' },
              { id: 'PENDING', label: 'Pending Payment' },
              { id: 'EXPIRED', label: 'Expired / Inactive' }
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

          <div className="filter-chip-container" style={{ margin: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '60px' }}>
              Plan:
            </span>
            <button
              type="button"
              className={`filter-chip-pill ${planFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => { setPlanFilter('ALL'); setCurrentPage(1); }}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-chip-pill ${planFilter === 'EXPIRING_SOON' ? 'active' : ''}`}
              onClick={() => { setPlanFilter('EXPIRING_SOON'); setCurrentPage(1); }}
            >
              Expiring Soon (Within 7 Days)
            </button>
            {plans.map(p => (
              <button
                key={p.planID}
                type="button"
                className={`filter-chip-pill ${planFilter === p.planName ? 'active' : ''}`}
                onClick={() => { setPlanFilter(p.planName); setCurrentPage(1); }}
              >
                {p.planName}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-table-container" style={{ marginTop: '20px' }}>
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
              {paginatedSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No membership records found.
                  </td>
                </tr>
              ) : (
                paginatedSubscriptions.map((m, idx) => (
                  <tr key={m.id ? `ms-${m.id}-${idx}` : `mem-${m.memberID}-${idx}`}>
                    <td>
                      <span 
                        onClick={() => onViewProfile && onViewProfile(m)}
                        style={{ cursor: 'pointer', color: 'var(--brand-primary)', fontWeight: 700 }}
                        title="Click to view full member profile"
                      >
                        {m.fullName}
                      </span>
                    </td>
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
                    <td>
                      {m.endDate || 'N/A'}
                      {(() => {
                        const days = getDaysRemaining(m.endDate);
                        if (m.status === 'ACTIVE' && days !== null && days >= 0 && days <= 7) {
                          return (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: 'var(--color-pending-bg)',
                              color: 'var(--color-pending)',
                              border: '1px solid rgba(217, 119, 6, 0.3)'
                            }}>
                               {days}d left
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-round)',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: 
                          m.status === 'ACTIVE' ? 'var(--color-success-bg)' : 
                          m.status === 'PENDING' ? 'var(--color-pending-bg)' : 'var(--color-error-bg)',
                        color: 
                          m.status === 'ACTIVE' ? 'var(--color-success)' : 
                          m.status === 'PENDING' ? 'var(--color-pending)' : 'var(--color-error)',
                        border: `1px solid ${
                          m.status === 'ACTIVE' ? 'rgba(22, 163, 74, 0.25)' : 
                          m.status === 'PENDING' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(239, 68, 68, 0.25)'
                        }`
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="secondary"
                          onClick={() => onViewProfile && onViewProfile(m)}
                          style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto' }}
                        >
                          Profile
                        </Button>
                        {m.status === 'PENDING' && (
                          <Button
                            variant="secondary"
                            onClick={() => onPayPending(m)}
                            style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto', color: '#e6a100' }}
                          >
                            Pay Pending
                          </Button>
                        )}
                        {m.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            onClick={() => handleCancel(m)}
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

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="memberships"
        />
      </Card>

      {/* Subscription Overlay Popup Modal */}
      <MembershipFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        members={members.filter(m => {
          // Exclude members who already have an ACTIVE membership subscription
          const hasActive = recentMembers.some(
            sub => String(sub.memberID) === String(m.memberID) && sub.status === 'ACTIVE'
          );
          return !hasActive;
        })}
        plans={plans}
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={Boolean(cancellingItem)}
        onClose={() => setCancellingItem(null)}
        onConfirm={handleConfirmCancelMembership}
        title="Cancel Membership Subscription"
        message="Are you sure you want to cancel this membership? The status will be updated to Cancelled."
        itemName={cancellingItem ? `${cancellingItem.memberName || 'Member'} (${cancellingItem.planName || 'Membership'})` : ''}
        confirmText="Cancel Subscription"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}
