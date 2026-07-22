import React, { useState } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import MembershipFormModal from './MembershipFormModal';

export default function MembershipManagement({
  recentMembers = [],
  members = [],
  plans = [],
  onCreateMembership,
  onPayPending,
  onCancelMembership,
  onViewProfile,
  cashier,
  onShowAdminWarning
}) {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Calculate stats from memberships list
  const activeCount = recentMembers.filter(m => m.status === 'ACTIVE').length;
  const pendingCount = recentMembers.filter(m => m.status === 'PENDING').length;
  const otherCount = recentMembers.length - activeCount - pendingCount;

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
      const matchesPlan = planFilter === 'ALL' || m.planName === planFilter;
      return matchesSearch && matchesGender && matchesPlan;
    })
    .sort((a, b) => {
      if (sortBy === 'NAME_ASC') return (a.fullName || '').localeCompare(b.fullName || '');
      if (sortBy === 'NAME_DESC') return (b.fullName || '').localeCompare(a.fullName || '');
      if (sortBy === 'GENDER') return (a.gender || '').localeCompare(b.gender || '');
      if (sortBy === 'PLAN') return (a.planName || '').localeCompare(b.planName || '');
      if (sortBy === 'STATUS') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });

  const handleCancel = (membershipID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    onCancelMembership(membershipID);
  };

  const handleAddMembershipClick = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      await onCreateMembership(payload);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create membership subscription.');
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

        <div className="purity-card purity-metric-card">
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '210px' }}>
              <InputField
                placeholder="Search member or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-0"
                style={{ margin: 0 }}
              />
            </div>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">All Plans</option>
              {plans.map(p => (
                <option key={p.planID} value={p.planName}>{p.planName}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="DEFAULT">Sort by Default</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="NAME_DESC">Name (Z-A)</option>
              <option value="GENDER">Gender</option>
              <option value="PLAN">Gym Plan</option>
              <option value="STATUS">Status</option>
            </select>

            <Button
              onClick={handleAddMembershipClick}
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
            >
              Add Membership
            </Button>
          </div>
        </div>

        <div className="dashboard-table-container">
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
                filtered.map((m, idx) => (
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
                    <td>{m.endDate || 'N/A'}</td>
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
    </div>
  );
}
