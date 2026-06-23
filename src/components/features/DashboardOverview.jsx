import React from 'react';
import Button from '../ui/Button';

/**
 * DashboardOverview component.
 * @param {object} props
 * @param {Array} props.recentMembers - List of recent member registration records
 * @param {function} props.setActiveView - Handler to switch views
 */
export default function DashboardOverview({ recentMembers = [], setActiveView }) {
  return (
    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
      <div className="workspace-left">
        {/* Summary Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-label">Active Members</div>
              <div className="stat-value">{recentMembers.length + 142}</div>
            </div>
            <div className="stat-icon-wrapper" style={{ color: 'var(--accent-indigo)', backgroundColor: 'var(--accent-indigo-light)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Shift Sales</div>
              <div className="stat-value">$1,420.00</div>
            </div>
            <div className="stat-icon-wrapper" style={{ color: 'var(--accent-teal)', backgroundColor: 'var(--accent-teal-light)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-label">Active Gateway</div>
              <div className="stat-value">KHQR Active</div>
            </div>
            <div className="stat-icon-wrapper" style={{ color: 'var(--accent-orange)', backgroundColor: 'var(--accent-orange-light)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
          </div>
        </div>

        {/* Command Welcome Card with Direct Registration Button */}
        <div className="command-center-box">
          <div className="command-info-group">
            <h3>Welcome to the Cashier Dashboard</h3>
            <p>Process customer entries, track transaction totals, and create memberships.</p>
          </div>
          
          <Button
            onClick={() => setActiveView('register')}
            style={{ width: 'auto', minWidth: '200px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
            Register Member
          </Button>
        </div>

        {/* Database List Table */}
        <div className="dashboard-table-card">
          <div className="table-title-area">
            <h3 className="table-title">Recent Gym Registrations</h3>
          </div>
          
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>Plan Name</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 700 }}>{m.fullName}</td>
                    <td>{m.phoneNumber}</td>
                    <td>{m.gender}</td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {m.planName}
                      </span>
                    </td>
                    <td>
                      <span className="member-status-tag">{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
