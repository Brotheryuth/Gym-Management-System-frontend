import React from 'react';
import Button from '../ui/Button';

/**
 * Header layout component.
 * @param {object} props
 * @param {string} props.activeView - Current active view ('dashboard' | 'register')
 * @param {boolean} props.isSimulated - Connection status (mock vs system)
 * @param {object} props.cashier - Active cashier profile details
 * @param {function} props.logout - Log out handler
 */
export default function Header({ activeView, isSimulated, cashier, logout }) {
  return (
    <header className="dashboard-header">
      <h2 className="header-title">
        {activeView === 'dashboard' ? 'Dashboard Overview' : 'Register Member'}
      </h2>
      
      <div className="header-meta">
        <div className={`status-badge ${isSimulated ? 'simulated' : 'connected'}`}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isSimulated ? '#64748b' : 'var(--color-active-green)',
            display: 'inline-block'
          }} />
          {isSimulated ? 'Simulation Active' : 'System Connected'}
        </div>

        {cashier && (
          <div className="user-info">
            Cashier: <strong>{cashier.name}</strong> | Shift: <strong>{cashier.shift}</strong>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={logout}
          className="logout-btn"
          style={{ minHeight: '36px', padding: '6px 12px', width: 'auto', fontWeight: 600 }}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
