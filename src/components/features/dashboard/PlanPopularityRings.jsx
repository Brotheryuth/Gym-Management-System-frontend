import React, { useState, useEffect } from 'react';

export default function PlanPopularityRings({ recentMembers = [], plans = [], onSelectPlan }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animatingRingIdx, setAnimatingRingIdx] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    setAnimatingRingIdx(null);
    setHoverProgress(true);
  };

  const handleItemHover = (idx) => {
    if (hoveredIndex === idx) return;
    setHoveredIndex(idx);
    setAnimatingRingIdx(null);
    setTimeout(() => {
      setAnimatingRingIdx(idx);
    }, 20);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const totalCount = recentMembers.length || 1;

  const colors = ['#f47609', '#10b981', '#6366f1', '#ec4899'];
  const trackColors = [
    'rgba(244, 118, 9, 0.15)',
    'rgba(16, 185, 129, 0.15)',
    'rgba(99, 102, 241, 0.15)',
    'rgba(236, 72, 153, 0.15)'
  ];
  const radii = [54, 40, 26];

  const planList = plans.length > 0 ? plans.slice(0, 3) : [
    { planName: 'Standard 1 Month' },
    { planName: 'Premium 3 Months' },
    { planName: 'Elite Year VIP' }
  ];

  const items = planList.map((plan, idx) => {
    const name = plan.planName || 'Standard 1 Month';
    const count = recentMembers.filter(m => m.planName === name).length;
    const r = radii[idx] || 26;
    const circumference = 2 * Math.PI * r;
    const pct = totalCount > 0 ? Math.min(100, Math.round((count / totalCount) * 100)) : 0;
    return {
      name,
      count,
      pct,
      color: colors[idx % colors.length],
      trackColor: trackColors[idx % trackColors.length],
      r,
      circumference
    };
  });

  const center = 70;
  const baseStrokeWidth = 8.5;

  const getOffset = (circumference, pct) => {
    const safePct = Math.max(3, Math.min(100, pct));
    return circumference - (circumference * safePct) / 100;
  };

  const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null;

  // Smart overlay positioning: when cursor approaches right edge (>150px), flip tooltip to left side of cursor so it floats 100% unclipped and never triggers layout shifts
  const isNearRightEdge = mousePos.x > 150;
  const tooltipX = isNearRightEdge
    ? Math.max(10, mousePos.x - 120)
    : mousePos.x + 14;
  const tooltipY = Math.max(10, mousePos.y - 32);

  return (
    <div
      className="purity-card plan-rings-card"
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 20px', position: 'relative' }}
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
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
          Hover ring to inspect tier breakdown
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
                strokeWidth={hoveredIndex === idx ? 11 : baseStrokeWidth}
                style={{ transition: 'all 0.3s ease' }}
              />
            ))}

            {/* Concentric Progress Rings with Invisible 360 Hit Target */}
            {items.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              const isDimmed = hoveredIndex !== null && !isHovered;
              const targetOffset = getOffset(item.circumference, item.pct);
              const isRingGrowing = isHovered && animatingRingIdx === idx;
              
              const currentOffset = isHovered
                ? (isRingGrowing ? targetOffset : item.circumference)
                : (isCardHovered ? (hoverProgress ? targetOffset : item.circumference) : (isAnimated ? targetOffset : item.circumference));

              return (
                <g key={`ring-group-${idx}`}>
                  {/* Invisible 360-degree hit-target circle */}
                  <circle
                    cx={center}
                    cy={center}
                    r={item.r}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                    onMouseEnter={() => handleItemHover(idx)}
                    onMouseLeave={() => { setHoveredIndex(null); setAnimatingRingIdx(null); }}
                    onClick={() => onSelectPlan && onSelectPlan(item.name)}
                  />

                  {/* Visible Progress Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={item.r}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={isHovered ? 11 : baseStrokeWidth}
                    strokeDasharray={item.circumference}
                    strokeDashoffset={currentOffset}
                    strokeLinecap="round"
                    style={{
                      pointerEvents: 'none',
                      opacity: isDimmed ? 0.25 : 1,
                      filter: isHovered
                        ? `drop-shadow(0 0 10px ${item.color}) brightness(1.2)`
                        : (isCardHovered ? `drop-shadow(0 0 3px ${item.color})` : 'none'),
                      transition: isHovered
                        ? (isRingGrowing ? 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.25, 0.64, 1), stroke-width 0.3s ease, opacity 0.3s ease, filter 0.3s ease' : 'none')
                        : (isCardHovered && !hoverProgress
                            ? 'none'
                            : `stroke-dashoffset 2.25s cubic-bezier(0.34, 1.25, 0.64, 1) ${idx * 110}ms, stroke-width 0.3s ease, opacity 0.3s ease, filter 0.3s ease`)
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Label (Fixed Total Active Count - Never Resizes) */}
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

        {/* Legend List (Fixed Height Rows - Zero Layout Shift) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
          {items.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={idx}
                className="ring-legend-row"
                onMouseEnter={() => handleItemHover(idx)}
                onMouseLeave={() => { setHoveredIndex(null); setAnimatingRingIdx(null); }}
                onClick={() => onSelectPlan && onSelectPlan(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  backgroundColor: isHovered ? `${item.color}18` : 'transparent',
                  border: '1px solid',
                  borderColor: isHovered ? `${item.color}40` : 'transparent',
                  boxSizing: 'border-box',
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontWeight: isHovered ? 700 : 600,
                    color: isHovered ? item.color : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
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

      {hoveredItem && (
        <div style={{
          position: 'absolute',
          top: `${tooltipY}px`,
          left: `${tooltipX}px`,
          pointerEvents: 'none',
          zIndex: 999,
          backgroundColor: '#1E1B18',
          color: '#FAFAF9',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          boxShadow: `0 10px 25px rgba(0,0,0,0.35), 0 0 0 1.5px ${hoveredItem.color}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'gamePopIn 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
          whiteSpace: 'nowrap'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: hoveredItem.color,
            boxShadow: `0 0 8px ${hoveredItem.color}`
          }} />
          <span style={{
            backgroundColor: hoveredItem.color,
            color: '#ffffff',
            fontSize: '9.5px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            Click ?
          </span>
        </div>
      )}
    </div>
  );
}
