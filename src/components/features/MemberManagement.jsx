import React, { useState } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import MemberFormModal from './MemberFormModal';

export default function MemberManagement({
  members = [],
  onRegisterMember,
  onUpdateMember,
  onDeleteMember,
  cashier,
  onShowAdminWarning
}) {
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Stats Box calculations
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
  const inactiveMembers = totalMembers - activeMembers;

  // 2. Filter list
  const filteredMembers = members.filter(m => {
    const term = search.toLowerCase();
    return (
      (m.fullName && m.fullName.toLowerCase().includes(term)) ||
      (m.phoneNumber && m.phoneNumber.toLowerCase().includes(term)) ||
      (m.memberID && m.memberID.toLowerCase().includes(term))
    );
  });

  const handleRegisterClick = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (memberID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    onDeleteMember(memberID);
  };

  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedMember) {
        // Edit mode
        await onUpdateMember(selectedMember.memberID, formData);
      } else {
        // Create mode
        await onRegisterMember(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'An error occurred while saving the member profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-overview-container">
      {/* 1. Stats dashboard box */}
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Total Members</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">{totalMembers}</span>
            </div>
          </div>
          <div className="purity-metric-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Active Members</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: '#4bbe04' }}>{activeMembers}</span>
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
            <h5>Inactive / Pending</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ color: 'var(--color-error)' }}>{inactiveMembers}</span>
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
      </div>

      {/* 2. Main data Card */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Registered Member Profiles
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '250px' }}>
              <InputField
                placeholder="Search by name, ID or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-0"
                style={{ margin: 0 }}
              />
            </div>
            <Button
              onClick={handleRegisterClick}
              style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
            >
              Register Member
            </Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No member profiles found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m, idx) => (
                  <tr key={m.memberID ? `m-${m.memberID}-${idx}` : `m-idx-${idx}`}>
                    <td style={{ fontWeight: 'bold' }}>{m.memberID || 'N/A'}</td>
                    <td>
                      <span className="member-name-cell">{m.fullName}</span>
                    </td>
                    <td>{m.phoneNumber}</td>
                    <td>{m.dob}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text-muted)'
                      }}>
                        {m.gender}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-round)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        backgroundColor: m.status === 'ACTIVE' ? 'rgba(75, 190, 4, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                        color: m.status === 'ACTIVE' ? '#2e7d32' : 'var(--color-error)'
                      }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="secondary"
                          onClick={() => handleEditClick(m)}
                          style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', width: 'auto' }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(m.memberID)}
                          style={{
                            minHeight: '32px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            width: 'auto',
                            color: 'var(--color-error)',
                            border: '1.5px solid transparent'
                          }}
                          className="delete-member-btn"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Member Creation & Edit Popup Overlay Modal */}
      <MemberFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
        isLoading={isSaving}
      />
    </div>
  );
}
