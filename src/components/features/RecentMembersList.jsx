import React from 'react';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

export default function RecentMembersList({ members = [], isLoading }) {
  return (
    <Card style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <h3 className="form-section-title" style={{ borderLeftColor: 'var(--text-primary)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Recent Registrations
      </h3>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="12px" style={{ marginBottom: '6px' }} />
              <Skeleton width="30%" height="18px" borderRadius="10px" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
          No active shift registrations yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {member.fullName}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  📞 {member.phoneNumber} | {member.gender}
                </p>
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  backgroundColor: 'var(--bg-canvas)',
                  color: 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '6px',
                  fontWeight: 600
                }}>
                  {member.planName}
                </span>
              </div>
              
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-success)',
                backgroundColor: 'var(--color-success-bg)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-round)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
