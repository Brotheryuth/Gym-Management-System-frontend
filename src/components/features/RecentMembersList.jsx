import React, { useState } from 'react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import Pagination from '../ui/Pagination';

export default function RecentMembersList({ members = [], isLoading, onViewProfile }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const paginatedMembers = members.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', padding: '20px', position: 'relative' }}>
      <h3 className="form-section-title" style={{ borderLeftColor: 'var(--text-primary)', marginBottom: '16px', flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Recent Registrations
      </h3>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="12px" style={{ marginBottom: '6px' }} />
              <Skeleton width="30%" height="18px" borderRadius="10px" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0', flex: 1 }}>
          No active shift registrations yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {paginatedMembers.map((member, idx) => {
              const isActive = (member.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
              return (
                <div
                  key={member.id ? `rm-${member.id}-${idx}` : `rm-idx-${idx}`}
                  className="recent-member-item"
                  onClick={() => onViewProfile && onViewProfile(member)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view full member profile"
                >
                  <div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {member.fullName}
                    </h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {member.phoneNumber} • {member.gender}
                      </span>
                    </div>

                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      backgroundColor: 'var(--bg-canvas)',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '6px',
                      fontWeight: 600,
                      border: '1px solid var(--color-border)'
                    }}>
                      {member.planName}
                    </span>
                  </div>
                  
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-round)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: isActive ? 'var(--color-success-bg)' : 'var(--color-pending-bg)',
                    color: isActive ? 'var(--color-success)' : 'var(--color-pending)',
                    border: `1px solid ${isActive ? 'rgba(22, 163, 74, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
                    whiteSpace: 'nowrap'
                  }}>
                    {member.status || 'ACTIVE'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '12px', flexShrink: 0, background: 'var(--bg-surface)' }}>
            <Pagination
              currentPage={currentPage}
              totalItems={members.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="registrations"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
