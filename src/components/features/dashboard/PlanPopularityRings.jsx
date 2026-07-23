import React from 'react';

export default function PlanPopularityRings({ recentMembers = [], plans = [] }) {
  const totalCount = recentMembers.length || 1;

  // Aggregate member counts per plan name or map to top 3 plan categories
  const planMap = {};
  recentMembers.forEach(m => {
    const pName = m.planName || 'Standard Monthly';
    planMap[pName] = (planMap[pName] || 0) + 1;
  });

  // If plans list is available, ensure top plans are represented
  const planEntries = Object.entries(planMap).sort((a, b) => b[1] - a[1]);
  
  // Default fallbacks if no registrations exist yet
  const top3 = [
    {
      name: planEntries[0]?.[0] || 'Standard Monthly',
      count: planEntries[0]?.[1] || (recentMembers.length ? 1 : 0),
      color: '#f47609', // Amber / Orange (Outer Ring)
      trackColor: 'rgba(244, 118, 9, 0.15)'
    },
    {
      name: planEntries[1]?.[0] || 'VIP Annual',
      count: planEntries[1]?.[1] || 0,
      color: '#10b981', // Emerald Green (Middle Ring)
      trackColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      name: planEntries[2]?.[0] || 'Student / Day Pass',
      count: planEntries[2]?.[1] || 0,
      color: '#6366f1', // Indigo / Cyan (Inner Ring)
      trackColor: 'rgba(99, 102, 241, 0.15)'
    }
  ];

  // Calculate percentages
  const items = top3.map(p => ({
    ...p,
    pct: totalCount > 0 ? Math.min(100, Math.round((p.count / totalCount) * 100)) : 0
  }));

  // SVG Concentric Ring Dimensions
  const center = 70;
  const outerR = 54;
  const midR = 40;
  const innerR = 26;
  const strokeWidth = 8.5;

  const outerCircumference = 2 * Math.PI * outerR;
  const midCircumference = 2 * Math.PI * midR;
  const innerCircumference = 2 * Math.PI * innerR;

  const getOffset = (circumference, pct) => {
    const safePct = Math.max(2, Math.min(100, pct)); // min 2% so ring tip is visible if > 0
    return circumference - (circumference * safePct) / 100;
  };

  return (
    <div className="purity-card plan-rings-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 20px' }}>
      {/* Header */}
      <div>
        <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--brand-primary)' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
          Plan Popularity
        </h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
          Active subscription tier distribution.
        </p>
      </div>

      {/* Main Rings + Legend Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Apple Watch Style Concentric SVG Rings */}
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {/* Background Tracks */}
            <circle cx={center} cy={center} r={outerR} fill="none" stroke={items[0].trackColor} strokeWidth={strokeWidth} />
            <circle cx={center} cy={center} r={midR} fill="none" stroke={items[1].trackColor} strokeWidth={strokeWidth} />
            <circle cx={center} cy={center} r={innerR} fill="none" stroke={items[2].trackColor} strokeWidth={strokeWidth} />

            {/* Animated Concentric Rings */}
            {/* Outer Ring */}
            <circle
              className="ring-bar ring-outer"
              cx={center}
              cy={center}
              r={outerR}
              fill="none"
              stroke={items[0].color}
              strokeWidth={strokeWidth}
              strokeDasharray={outerCircumference}
              strokeDashoffset={getOffset(outerCircumference, items[0].pct)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.25, 0.64, 1)' }}
            />

            {/* Middle Ring */}
            <circle
              className="ring-bar ring-mid"
              cx={center}
              cy={center}
              r={midR}
              fill="none"
              stroke={items[1].color}
              strokeWidth={strokeWidth}
              strokeDasharray={midCircumference}
              strokeDashoffset={getOffset(midCircumference, items[1].pct)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.25, 0.64, 1)' }}
            />

            {/* Inner Ring */}
            <circle
              className="ring-bar ring-inner"
              cx={center}
              cy={center}
              r={innerR}
              fill="none"
              stroke={items[2].color}
              strokeWidth={strokeWidth}
              strokeDasharray={innerCircumference}
              strokeDashoffset={getOffset(innerCircumference, items[2].pct)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.25, 0.64, 1)' }}
            />
          </svg>

          {/* Center Summary Label */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {recentMembers.length}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
              Active
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
          {items.map((item, idx) => (
            <div key={idx} className="ring-legend-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  flexShrink: 0
                }} />
                <span style={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} title={item.name}>
                  {item.name}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>
                {item.count} ({item.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
