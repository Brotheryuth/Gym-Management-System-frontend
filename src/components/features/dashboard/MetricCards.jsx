import React from 'react';

export default function MetricCards({
  todaySales = 0,
  salesChangePercent = 0,
  activeMembersCount = 0,
  activeChangePercent = 0,
  todayNewMembersCount = 0,
  newClientsChangePercent = 0,
  totalSales = 0,
  revenueGoalPct = 0,
  capacityGoalPct = 0
}) {
  const newClientsGoalPct = Math.min(100, todayNewMembersCount * 10);

  return (
    <div className="purity-grid-4">
      {/* 1. Today's Money */}
      <div className="purity-card purity-metric-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today's Money</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              ${todaySales.toFixed(2)}
            </div>
          </div>
          <div className={`purity-change-badge ${salesChangePercent >= 0 ? 'plus' : 'minus'}`} style={{
            background: salesChangePercent >= 0 ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: salesChangePercent >= 0 ? 'var(--color-success)' : 'var(--color-error)'
          }}>
            {salesChangePercent >= 0 ? `+${salesChangePercent}%` : `${salesChangePercent}%`}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Daily Goal ($500)</span>
            <span style={{ fontWeight: 700 }}>{revenueGoalPct}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${revenueGoalPct}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '3px', transition: 'width 0.5s ease-in-out' }} />
          </div>
        </div>
      </div>

      {/* 2. Active Members */}
      <div className="purity-card purity-metric-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Members</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {activeMembersCount}
            </div>
          </div>
          <div className={`purity-change-badge ${activeChangePercent >= 0 ? 'plus' : 'minus'}`} style={{
            background: activeChangePercent >= 0 ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: activeChangePercent >= 0 ? 'var(--color-success)' : 'var(--color-error)'
          }}>
            {activeChangePercent >= 0 ? `+${activeChangePercent}%` : `${activeChangePercent}%`}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Capacity (150 max)</span>
            <span style={{ fontWeight: 700 }}>{capacityGoalPct}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${capacityGoalPct}%`, height: '100%', background: '#4bbe04', borderRadius: '3px', transition: 'width 0.5s ease-in-out' }} />
          </div>
        </div>
      </div>

      {/* 3. New Clients Today */}
      <div className="purity-card purity-metric-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Signups</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {todayNewMembersCount}
            </div>
          </div>
          <div className={`purity-change-badge ${newClientsChangePercent >= 0 ? 'plus' : 'minus'}`} style={{
            background: newClientsChangePercent >= 0 ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            color: newClientsChangePercent >= 0 ? 'var(--color-success)' : 'var(--color-error)'
          }}>
            {newClientsChangePercent >= 0 ? `+${newClientsChangePercent}%` : `${newClientsChangePercent}%`}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>Daily Target (10)</span>
            <span style={{ fontWeight: 700 }}>{newClientsGoalPct}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${newClientsGoalPct}%`, height: '100%', background: 'var(--accent-warm)', borderRadius: '3px', transition: 'width 0.5s ease-in-out' }} />
          </div>
        </div>
      </div>

      {/* 4. Total Sales */}
      <div className="purity-card purity-metric-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              ${totalSales.toFixed(2)}
            </div>
          </div>
          <div className="purity-change-badge plus" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            Live
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>System Health</span>
            <span style={{ fontWeight: 700, color: '#4bbe04' }}>100% Online</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: '#4bbe04', borderRadius: '3px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
