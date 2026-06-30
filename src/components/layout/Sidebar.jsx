import React from 'react';

/**
 * Sidebar layout component.
 * @param {object} props
 * @param {string} props.activeView - Current active view ('dashboard' | 'register')
 * @param {function} props.setActiveView - Function to switch the active view
 */
export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">G</div>
        <div className="sidebar-title">Gym<span>Management</span></div>
      </div>

      <nav className="sidebar-nav">
        <button 
          type="button" 
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          Dashboard Overview
        </button>
        
        <button 
          type="button" 
          className={`nav-item ${activeView === 'register' ? 'active' : ''}`}
          onClick={() => setActiveView('register')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="17" y1="11" x2="23" y2="11"></line>
          </svg>
          Register Member
        </button>

        <button 
          type="button" 
          className={`nav-item ${activeView === 'members' ? 'active' : ''}`}
          onClick={() => setActiveView('members')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Manage Members
        </button>

        <button 
          type="button" 
          className={`nav-item ${activeView === 'memberships' ? 'active' : ''}`}
          onClick={() => setActiveView('memberships')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Manage Memberships
        </button>

        <button 
          type="button" 
          className={`nav-item ${activeView === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveView('plans')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Gym Plans
        </button>
        
        <button 
          type="button" 
          className={`nav-item ${activeView === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveView('payments')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Billing Ledger
        </button>
      </nav>

      <div className="sidebar-footer">
        Terminal Console v1.0.0
      </div>
    </aside>
  );
}
