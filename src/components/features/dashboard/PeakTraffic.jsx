import React from 'react';

export default function PeakTraffic({
  slots = [],
  slotCounts = [],
  maxSlotCount = 1
}) {
  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#4bbe04' }}>
            <path d="M18 20V10M12 20V4M6 20v-6"></path>
          </svg>
          Peak Attendance Traffic
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Distribution of member check-ins throughout the slots.</p>
      </div>

      <div style={{ display: 'flex', height: '120px', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', padding: '10px 0 0 0', borderBottom: '1.5px solid var(--color-border)' }}>
        {slots.map((slot, idx) => {
          const count = slotCounts[idx] || 0;
          const heightPct = Math.max(10, (count / maxSlotCount) * 100);
          return (
            <div key={slot} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>{count}</span>
              <div style={{
                width: '100%',
                height: `${heightPct}px`,
                background: 'var(--brand-primary)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease-in-out'
              }} />
            </div>
          );
        })}
      </div>

      {/* Time Slot Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
        {slots.map(slot => (
          <span key={slot} style={{ flex: 1, textAlign: 'center' }}>{slot}</span>
        ))}
      </div>
    </div>
  );
}
