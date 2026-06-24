import React from 'react';

export default function SalesLineChart({
  salesPoints = '',
  transPoints = '',
  salesAreaPoints = '',
  transAreaPoints = '',
  monthlySales = [],
  maxSales = 100,
  months = []
}) {
  return (
    <div className="purity-card purity-chart-card">
      <div className="purity-chart-header">
        <h4 className="purity-chart-title" style={{ color: 'var(--text-primary)' }}>Sales Overview</h4>
        <div className="purity-chart-subtitle" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--color-active-green)' }}>(+5% more)</span> dynamic monthly projections
        </div>
      </div>
      
      <div className="purity-chart-box" style={{ background: '#ffffff', border: '1px solid var(--color-border)' }}>
        <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
          {/* Gradients */}
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--text-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1="30" y1="20" x2="470" y2="20" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="50" x2="470" y2="50" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="80" x2="470" y2="80" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="110" x2="470" y2="110" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="30" y1="130" x2="470" y2="130" stroke="var(--color-border)" strokeWidth="1.5" />

          {/* Area Under Sales */}
          {salesAreaPoints && <polygon points={salesAreaPoints} fill="url(#salesGrad)" />}
          
          {/* Area Under Transactions */}
          {transAreaPoints && <polygon points={transAreaPoints} fill="url(#transGrad)" />}

          {/* Sales Line */}
          {salesPoints && <polyline points={salesPoints} fill="none" stroke="var(--accent-blue)" strokeWidth="3" strokeLinecap="round" />}
          
          {/* Transactions Line */}
          {transPoints && <polyline points={transPoints} fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" />}

          {/* Dots on points */}
          {monthlySales.map((val, idx) => {
            if (val === 0) return null;
            const x = 30 + (idx * 40);
            const y = 130 - (val / maxSales) * 110;
            return <circle key={idx} cx={x} cy={y} r="4" fill="var(--accent-blue)" stroke="#ffffff" strokeWidth="1.5" />;
          })}

          {/* Month Labels */}
          {months.map((m, idx) => {
            const x = 30 + (idx * 40);
            return (
              <text key={m} x={x} y="145" fill="var(--text-muted)" fontSize="9" fontWeight="600" textAnchor="middle">
                {m}
              </text>
            );
          })}
        </svg>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--accent-blue)' }}></div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Monthly Revenue ($)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '1.5px', borderTop: '2.5px dashed var(--text-primary)' }}></div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Transactions (Vol)</span>
        </div>
      </div>
    </div>
  );
}
