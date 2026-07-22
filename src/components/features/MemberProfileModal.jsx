import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';

export default function MemberProfileModal({
  isOpen,
  onClose,
  member,
  recentMembers = [],
  payments = [],
  onSubscribeMember
}) {
  const [currentPage, setCurrentPage] = useState(1);
  if (!isOpen || !member) return null;

  // Find membership record for this member
  const membership = recentMembers.find(
    m => String(m.memberID) === String(member.memberID || member.id) ||
         (m.fullName && member.fullName && m.fullName.toLowerCase() === member.fullName.toLowerCase())
  );

  // Find payment history
  const memberPayments = payments.filter(
    p => String(p.membershipID) === String(membership?.id) ||
         String(p.memberID) === String(member.memberID || member.id)
  );

  const pageSize = 20;
  const paginatedPayments = memberPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasActivePlan = membership && membership.status === 'ACTIVE';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile Overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 800,
            flexShrink: 0
          }}>
            {(member.fullName || 'M')[0].toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {member.fullName}
            </h3>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Member ID: <strong>#{member.memberID || member.id || 'N/A'}</strong>
            </span>
          </div>
        </div>

        {/* Profile Personal Specs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
              Phone Number
            </span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
              {member.phoneNumber || 'N/A'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
              Date of Birth
            </span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
              {member.dob || 'N/A'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
              Gender
            </span>
            <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
              {member.gender || 'N/A'}
            </strong>
          </div>
        </div>

        {/* Membership Subscription Status */}
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: membership ? '1px solid var(--color-border)' : '1.5px dashed var(--color-border)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Gym Subscription Plan
          </h4>

          {membership ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  display: 'block'
                }}>
                  {membership.planName || 'Gym Plan'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {membership.startDate && membership.endDate
                    ? `Valid: ${membership.startDate} → ${membership.endDate}`
                    : `Registered: ${membership.startDate || 'N/A'}`}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 'var(--radius-round)',
                textTransform: 'uppercase',
                backgroundColor: hasActivePlan ? 'var(--color-success-bg)' : 'var(--color-pending-bg)',
                color: hasActivePlan ? 'var(--color-success)' : 'var(--color-pending)',
                border: `1px solid ${hasActivePlan ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`
              }}>
                {membership.status || 'ACTIVE'}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <span style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '10px'
              }}>
                No Subscribed Plan
              </span>
              {onSubscribeMember && (
                <Button
                  onClick={() => {
                    onClose();
                    onSubscribeMember(member);
                  }}
                  style={{ width: 'auto', minHeight: '34px', padding: '4px 16px', fontSize: '12px', margin: '0 auto' }}
                >
                  + Subscribe Member to Plan
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Transaction History (if any) */}
        {memberPayments.length > 0 && (
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Billing Transactions ({memberPayments.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
              {paginatedPayments.map(p => (
                <div key={p.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px'
                }}>
                  <span>Ref #{p.id} • {p.method || 'KHQR'}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    ${Number(p.finalAmount).toFixed(2)} ({p.status})
                  </strong>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={memberPayments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="transactions"
            />
          </div>
        )}

      </div>
    </Modal>
  );
}
