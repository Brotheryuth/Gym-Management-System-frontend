import React from 'react';

export default function PeakTraffic({
  slots = [],
  slotCounts = [],
  maxSlotCount = 1
}) {
  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 20px' }}>
      <div>
        <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#4bbe04' }}>
            <path d="M18 20V10M12 20V4M6 20v-6"></path>
          </svg>
          Peak Attendance Traffic
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Distribution of member check-ins throughout slots.</p>
      </div>

      <div style={{ display: 'flex', height: '75px', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', padding: '6px 0 0 0', borderBottom: '1.5px solid var(--color-border)' }}>
        {slots.map((slot, idx) => {
          const count = slotCounts[idx] || 0;
          const heightPct = Math.max(10, (count / maxSlotCount) * 100);
          return (
            <div key={slot} className="traffic-bar-item" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>{count}</span>
              <div className="traffic-bar-fill" style={{
                width: '100%',
                height: `${heightPct}px`,
                background: 'var(--brand-primary)',
                borderRadius: '4px 4px 0 0'
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
