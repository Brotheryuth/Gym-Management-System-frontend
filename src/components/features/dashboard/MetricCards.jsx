import React from 'react';

export default function MetricCards({
  todaySales = 0,
  salesChangePercent = 0,
  activeMembersCount = 0,
  activeChangePercent = 0,
  todayNewMembersCount = 0,
  newClientsChangePercent = 0,
  totalSales = 0
}) {
  return (
    <div className="purity-grid-4">
      {/* Today's Money */}
      <div className="purity-card purity-metric-card">
        <div className="purity-metric-info">
          <h5>Today's Money</h5>
          <div className="purity-metric-value-row">
            <span className="purity-metric-value">${todaySales.toFixed(2)}</span>
            <span className={`purity-change-badge ${salesChangePercent >= 0 ? 'plus' : 'minus'}`}>
              {salesChangePercent >= 0 ? `+${salesChangePercent}%` : `${salesChangePercent}%`}
            </span>
          </div>
        </div>
        <div className="purity-metric-icon teal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
      </div>

      {/* Active Members */}
      <div className="purity-card purity-metric-card">
        <div className="purity-metric-info">
          <h5>Active Members</h5>
          <div className="purity-metric-value-row">
            <span className="purity-metric-value">{activeMembersCount}</span>
            <span className={`purity-change-badge ${activeChangePercent >= 0 ? 'plus' : 'minus'}`}>
              {activeChangePercent >= 0 ? `+${activeChangePercent}%` : `${activeChangePercent}%`}
            </span>
          </div>
        </div>
        <div className="purity-metric-icon blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>

      {/* New Clients */}
      <div className="purity-card purity-metric-card">
        <div className="purity-metric-info">
          <h5>New Clients (Today)</h5>
          <div className="purity-metric-value-row">
            <span className="purity-metric-value">{todayNewMembersCount}</span>
            <span className={`purity-change-badge ${newClientsChangePercent >= 0 ? 'plus' : 'minus'}`}>
              {newClientsChangePercent >= 0 ? `+${newClientsChangePercent}%` : `${newClientsChangePercent}%`}
            </span>
          </div>
        </div>
        <div className="purity-metric-icon orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="17" y1="11" x2="23" y2="11"></line>
          </svg>
        </div>
      </div>

      {/* Total Sales */}
      <div className="purity-card purity-metric-card">
        <div className="purity-metric-info">
          <h5>Total Sales</h5>
          <div className="purity-metric-value-row">
            <span className="purity-metric-value">${totalSales.toFixed(2)}</span>
            <span className="purity-change-badge plus">+100%</span>
          </div>
        </div>
        <div className="purity-metric-icon green">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
