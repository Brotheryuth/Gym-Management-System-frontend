import React from 'react';

export default function TrafficBarChart({
  recentMembersCount = 0,
  todayNewMembersCount = 0,
  totalSales = 0,
  slotCounts = [],
  slots = [],
  maxSlotCount = 5
}) {
  return (
    <div className="purity-card purity-chart-card">
      <div className="purity-chart-header">
        <h4 className="purity-chart-title" style={{ color: 'var(--text-primary)' }}>Active Gym Traffic</h4>
        <div className="purity-chart-subtitle" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--color-active-green)' }}>(+23%)</span> than last week check-ins
        </div>
      </div>
      
      <div className="purity-chart-box dark" style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-hover) 100%)' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
          {/* Grid Lines */}
          <line x1="20" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="20" y1="50" x2="380" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="20" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="20" y1="110" x2="380" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="20" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          
          {/* Bars */}
          {slotCounts.map((val, idx) => {
            const barWidth = 22;
            const gap = (360 - (slotCounts.length * barWidth)) / (slotCounts.length - 1);
            const x = 20 + idx * (barWidth + gap);
            const barHeight = (val / maxSlotCount) * 110;
            const y = 140 - barHeight;
            
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  rx="4"
                  fill="var(--brand-vanilla)"
                  opacity="0.95"
                />
                <text
                  x={x + barWidth / 2}
                  y="155"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {slots[idx]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="purity-chart-stats">
        <div className="purity-stat-item">
          <div className="purity-stat-header">
            <div className="purity-stat-dot-icon teal">U</div>
            <span className="purity-stat-name">Members</span>
          </div>
          <span className="purity-stat-value" style={{ color: 'var(--text-primary)' }}>{recentMembersCount}</span>
          <div className="purity-stat-indicator">
            <div className="purity-stat-indicator-fill teal" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="purity-stat-item">
          <div className="purity-stat-header">
            <div className="purity-stat-dot-icon blue">C</div>
            <span className="purity-stat-name">Today New</span>
          </div>
          <span className="purity-stat-value" style={{ color: 'var(--text-primary)' }}>{todayNewMembersCount}</span>
          <div className="purity-stat-indicator">
            <div className="purity-stat-indicator-fill blue" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="purity-stat-item">
          <div className="purity-stat-header">
            <div className="purity-stat-dot-icon orange">S</div>
            <span className="purity-stat-name">Sales ($)</span>
          </div>
          <span className="purity-stat-value" style={{ color: 'var(--text-primary)' }}>${totalSales.toFixed(0)}</span>
          <div className="purity-stat-indicator">
            <div className="purity-stat-indicator-fill orange" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="purity-stat-item">
          <div className="purity-stat-header">
            <div className="purity-stat-dot-icon green">P</div>
            <span className="purity-stat-name">Active Gateway</span>
          </div>
          <span className="purity-stat-value" style={{ color: 'var(--text-primary)' }}>KHQR</span>
          <div className="purity-stat-indicator">
            <div className="purity-stat-indicator-fill green" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
