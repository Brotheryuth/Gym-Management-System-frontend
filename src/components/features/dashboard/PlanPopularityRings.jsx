import React, { useState, useEffect } from 'react';

export default function PlanPopularityRings({ recentMembers = [], plans = [] }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
    setHoverProgress(false);
    setTimeout(() => {
      setHoverProgress(true);
    }, 30);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    setHoveredIndex(null);
    setHoverProgress(true);
  };

  const totalCount = recentMembers.length || 1;

  // Aggregate member counts per plan name or map to top 3 plan categories
  const planMap = {};
  recentMembers.forEach(m => {
    const pName = m.planName || 'Standard Monthly';
    planMap[pName] = (planMap[pName] || 0) + 1;
  });

  const planEntries = Object.entries(planMap).sort((a, b) => b[1] - a[1]);
  
  // Default fallbacks if no registrations exist yet
  const top3 = [
    {
      name: planEntries[0]?.[0] || 'Standard Monthly',
      count: planEntries[0]?.[1] || (recentMembers.length ? 1 : 0),
      color: '#f47609', // Amber / Orange (Outer Ring)
      trackColor: 'rgba(244, 118, 9, 0.15)',
      r: 54,
      circumference: 2 * Math.PI * 54
    },
    {
      name: planEntries[1]?.[0] || 'VIP Annual',
      count: planEntries[1]?.[1] || 0,
      color: '#10b981', // Emerald Green (Middle Ring)
      trackColor: 'rgba(16, 185, 129, 0.15)',
      r: 40,
      circumference: 2 * Math.PI * 40
    },
    {
      name: planEntries[2]?.[0] || 'Student / Day Pass',
      count: planEntries[2]?.[1] || 0,
      color: '#6366f1', // Indigo / Purple (Inner Ring)
      trackColor: 'rgba(99, 102, 241, 0.15)',
      r: 26,
      circumference: 2 * Math.PI * 26
    }
  ];

  // Calculate percentages
  const items = top3.map(p => ({
    ...p,
    pct: totalCount > 0 ? Math.min(100, Math.round((p.count / totalCount) * 100)) : 0
  }));

  const center = 70;
  const baseStrokeWidth = 8.5;

  const getOffset = (circumference, pct) => {
    const safePct = Math.max(3, Math.min(100, pct)); // min 3% so ring tip is visible if > 0
    return circumference - (circumference * safePct) / 100;
  };

  const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null;

  return (
    <div
      className="purity-card plan-rings-card"
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 20px', position: 'relative' }}
    >
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
          Active subscription tier breakdown.
        </p>
      </div>

      {/* Main Rings + Legend Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Apple Watch Style Concentric SVG Rings */}
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {/* Background Tracks */}
            {items.map((item, idx) => (
              <circle
                key={`track-${idx}`}
                cx={center}
                cy={center}
                r={item.r}
                fill="none"
                stroke={item.trackColor}
                strokeWidth={hoveredIndex === idx ? 12 : baseStrokeWidth}
                style={{ transition: 'all 0.3s ease' }}
              />
            ))}

            {/* Concentric Progress Rings */}
            {items.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const isDimmed = hoveredIndex !== null && !isHovered;
              const targetOffset = getOffset(item.circumference, item.pct);
              
              // Displays normal analysis by default; re-triggers progression drawing from 0 to target on card hover
              const currentOffset = isCardHovered
                ? (hoverProgress ? targetOffset : item.circumference)
                : (isAnimated ? targetOffset : item.circumference);

              return (
                <circle
                  key={`ring-${idx}`}
                  cx={center}
                  cy={center}
                  r={item.r}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? 12 : baseStrokeWidth}
                  strokeDasharray={item.circumference}
                  strokeDashoffset={currentOffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    cursor: 'pointer',
                    pointerEvents: 'stroke',
                    opacity: isDimmed ? 0.22 : 1,
                    filter: isHovered
                      ? `drop-shadow(0 0 8px ${item.color}) brightness(1.2)`
                      : (isCardHovered ? `drop-shadow(0 0 3px ${item.color})` : 'none'),
                    transition: isCardHovered && !hoverProgress
                      ? 'none'
                      : `stroke-dashoffset 2.25s cubic-bezier(0.34, 1.25, 0.64, 1) ${idx * 110}ms, stroke-width 0.3s ease, opacity 0.3s ease, filter 0.3s ease`
                  }}
                />
              );
            })}
          </svg>

          {/* Center Label (Fixed Total Active Count) */}
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
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '4px'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {recentMembers.length}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '3px' }}>
              Active
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
          {items.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={idx}
                className="ring-legend-row"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  opacity: isDimmed ? 0.35 : 1,
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.25, 0.64, 1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{
                    width: isHovered ? '10px' : '8px',
                    height: isHovered ? '10px' : '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    boxShadow: isHovered ? `0 0 6px ${item.color}` : 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }} />
                  <span style={{
                    fontWeight: isHovered ? 700 : 600,
                    color: isHovered ? item.color : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }} title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: isHovered ? item.color : 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>
                  {item.count} ({item.pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
