import React from 'react';

export default function MemberDemographics({
  genderStats = { male: 0, female: 0, other: 0 },
  ageStats = { under18: 0, range18_25: 0, range26_35: 0, range36_50: 0, above50: 0 },
  totalCount = 0
}) {
  const malePct = totalCount > 0 ? Math.round((genderStats.male / totalCount) * 100) : 0;
  const femalePct = totalCount > 0 ? Math.round((genderStats.female / totalCount) * 100) : 0;
  const otherPct = totalCount > 0 ? 100 - malePct - femalePct : 0; // Ensures exactly 100% total
  const adjustedOtherPct = Math.max(0, otherPct);

  const ageGroups = [
    { label: 'Under 18', count: ageStats.under18 },
    { label: '18-25', count: ageStats.range18_25 },
    { label: '26-35', count: ageStats.range26_35 },
    { label: '36-50', count: ageStats.range36_50 },
    { label: '50+', count: ageStats.above50 }
  ];

  return (
    <div className="purity-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 20px' }}>
      {/* Header */}
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Member Demographics
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>Gender & age distribution of active members.</p>
      </div>

      {/* Gender Distribution Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gender Split</span>
        
        {/* Segmented Horizontal Bar */}
        <div className="analytics-progress-track" style={{
          height: '14px',
          background: 'var(--progress-track-bg, #E2E8F0)',
          borderRadius: '7px',
          overflow: 'hidden',
          display: 'flex',
          width: '100%',
          marginTop: '2px'
        }}>
          {totalCount === 0 ? (
            <div style={{ width: '100%', height: '100%', background: 'var(--progress-track-bg, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
              No active members
            </div>
          ) : (
            <>
              {genderStats.male > 0 && (
                <div className="analytics-progress-bar" style={{ width: `${malePct}%`, height: '100%', background: 'var(--brand-primary)', cursor: 'pointer' }} title={`Male: ${genderStats.male} (${malePct}%)`} />
              )}
              {genderStats.female > 0 && (
                <div className="analytics-progress-bar" style={{ width: `${femalePct}%`, height: '100%', background: 'var(--accent-warm)', cursor: 'pointer' }} title={`Female: ${genderStats.female} (${femalePct}%)`} />
              )}
              {genderStats.other > 0 && (
                <div className="analytics-progress-bar" style={{ width: `${adjustedOtherPct}%`, height: '100%', background: '#4bbe04', cursor: 'pointer' }} title={`Other: ${genderStats.other} (${adjustedOtherPct}%)`} />
              )}
            </>
          )}
        </div>

        {/* Legend - Equal 3 Columns Horizontally */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '4px', fontSize: '10.5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--brand-primary)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Male ({malePct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-warm)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Female ({femalePct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4bbe04', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Other ({adjustedOtherPct}%)</span>
          </div>
        </div>
      </div>

      {/* Age Distribution Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age Brackets</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ageGroups.map(group => {
            const pct = totalCount > 0 ? Math.round((group.count / totalCount) * 100) : 0;
            return (
              <div key={group.label} className="analytics-progress-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{group.label}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{group.count} ({pct}%)</span>
                </div>
                <div className="analytics-progress-track" style={{ height: '6px', background: 'var(--progress-track-bg, #E2E8F0)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="analytics-progress-bar" style={{ width: `${pct}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '3px', opacity: 0.85 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
