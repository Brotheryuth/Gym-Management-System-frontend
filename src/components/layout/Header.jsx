import React from 'react';

/**
 * Header layout component.
 * @param {object} props
 * @param {string} props.activeView - Current active view ('dashboard' | 'register')
 * @param {boolean} props.isOffline - Connection status (offline vs online)
 * @param {object} props.cashier - Active cashier profile details
 * @param {function} props.logout - Log out handler
 * @param {function} props.onToggleSidebar - Mobile sidebar toggle handler
 */
export default function Header({ activeView, isOffline, cashier, logout, onToggleSidebar }) {
  const titles = {
    dashboard: 'Dashboard Overview',
    register: 'Register Member',
    members: 'Manage Members',
    memberships: 'Manage Memberships',
    plans: 'Gym Membership Plans',
    payments: 'Billing Ledger & Receipts'
  };

  return (
    <header className="dashboard-header">
      <div className="header-title-wrapper">
        <button 
          type="button" 
          className="mobile-burger-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <h2 className="header-title" title={titles[activeView] || 'Gym Management'}>
          {titles[activeView] || 'Gym Management'}
        </h2>
      </div>
      
      <div className="header-meta">
        <div className={`status-badge ${isOffline ? 'offline' : 'connected'}`}>
          <span className="status-dot" />
          <span className="status-label">{isOffline ? 'Offline' : 'Connected'}</span>
        </div>

        {cashier && (
          <div className="user-info-pill" title={`Cashier: ${cashier.name} | Shift: ${cashier.shift}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="user-info-name">{cashier.name || 'Cashier'}</span>
            {cashier.shift && <span className="user-info-shift">{cashier.shift}</span>}
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          className="header-logout-btn"
          title="Sign Out"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="logout-label">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
