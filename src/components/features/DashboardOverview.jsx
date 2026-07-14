import React from 'react';
import Button from '../ui/Button';
import MetricCards from './dashboard/MetricCards';
import PaymentDistribution from './dashboard/PaymentDistribution';
import PeakTraffic from './dashboard/PeakTraffic';
import LiveCheckoutStream from './dashboard/LiveCheckoutStream';
import QuickShortcuts from './dashboard/QuickShortcuts';

export default function DashboardOverview({
  recentMembers = [],
  payments = [],
  setActiveView,
  onPayPending
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Yesterday's date string for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 1. Calculations for dynamic dashboard metrics
  const todayPayments = payments.filter(p => {
    if (p.status !== 'PAID') return false;
    const pDate = p.paymentDate || p.createAt;
    return pDate && String(pDate).startsWith(todayStr);
  });
  const todaySales = todayPayments.reduce((sum, p) => sum + p.finalAmount, 0);

  const yesterdayPayments = payments.filter(p => {
    if (p.status !== 'PAID') return false;
    const pDate = p.paymentDate || p.createAt;
    return pDate && String(pDate).startsWith(yesterdayStr);
  });
  const yesterdaySales = yesterdayPayments.reduce((sum, p) => sum + p.finalAmount, 0);

  let salesChangePercent = 0;
  if (yesterdaySales > 0) {
    salesChangePercent = Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100);
  } else if (todaySales > 0) {
    salesChangePercent = 100;
  }

  // Active Members
  const activeMembersCount = recentMembers.filter(m => m.status === 'ACTIVE').length;
  const activeMembersYesterday = recentMembers.filter(m => {
    if (m.status !== 'ACTIVE') return false;
    return !m.startDate || !String(m.startDate).startsWith(todayStr);
  }).length;

  let activeChangePercent = 0;
  if (activeMembersYesterday > 0) {
    activeChangePercent = Math.round(((activeMembersCount - activeMembersYesterday) / activeMembersYesterday) * 100);
  }

  // Today's New Clients
  const todayNewMembersCount = recentMembers.filter(m => {
    return m.startDate && String(m.startDate).startsWith(todayStr);
  }).length;

  const yesterdayNewMembersCount = recentMembers.filter(m => {
    return m.startDate && String(m.startDate).startsWith(yesterdayStr);
  }).length;

  let newClientsChangePercent = 0;
  if (yesterdayNewMembersCount > 0) {
    newClientsChangePercent = Math.round(((todayNewMembersCount - yesterdayNewMembersCount) / yesterdayNewMembersCount) * 100);
  } else if (todayNewMembersCount > 0) {
    newClientsChangePercent = 100;
  }

  // All-time Total Revenue
  const totalSales = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.finalAmount, 0);

  // 2. Gateway distribution data
  const khqrSum = payments.filter(p => p.status === 'PAID' && p.method === 'KHQR').reduce((s, p) => s + p.finalAmount, 0);
  const cashSum = payments.filter(p => p.status === 'PAID' && (p.method === 'BYCASH' || p.method === 'CASH')).reduce((s, p) => s + p.finalAmount, 0);
  const cardSum = payments.filter(p => p.status === 'PAID' && p.method === 'CREDITCARD').reduce((s, p) => s + p.finalAmount, 0);
  
  const gatewayTotal = khqrSum + cashSum + cardSum || 1;
  const khqrPct = Math.round((khqrSum / gatewayTotal) * 100);
  const cashPct = Math.round((cashSum / gatewayTotal) * 100);
  const cardPct = Math.round((cardSum / gatewayTotal) * 100);

  // 3. Hourly traffic Slots
  const slots = ["08:00", "12:00", "16:00", "18:00", "20:00", "22:00"];
  const slotCounts = Array(slots.length).fill(0);
  recentMembers.forEach(m => {
    const hash = (m.memberID || m.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const slotIdx = hash % slots.length;
    slotCounts[slotIdx]++;
  });
  const maxSlotCount = Math.max(...slotCounts, 1);

  // 4. Live activity feed - Get last 4 completed payments
  const recentPaidTransactions = [...payments]
    .filter(p => p.status === 'PAID')
    .sort((a, b) => new Date(b.paymentDate || b.createAt) - new Date(a.paymentDate || a.createAt))
    .slice(0, 4);

  const getMemberName = (paymentItem) => {
    const memberObj = recentMembers.find(m => String(m.memberID) === String(paymentItem.memberID || paymentItem.member?.id));
    return memberObj ? memberObj.fullName : paymentItem.memberName || 'Walk-in Customer';
  };

  // Target goals percentages
  const dailyRevenueGoal = 500;
  const revenueGoalPct = Math.min(100, Math.round((todaySales / dailyRevenueGoal) * 100));

  const memberCapacityGoal = 150;
  const capacityGoalPct = Math.min(100, Math.round((activeMembersCount / memberCapacityGoal) * 100));

  return (
    <div className="dashboard-overview-container">
      
      {/* Welcome & Command Header */}
      <div className="purity-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, #295b96 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '24px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-warm)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Operational Dashboard
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Cashier Control Center
          </h2>
          <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '8px', maxWidth: '520px', lineHeight: '1.5' }}>
            Monitor real-time payments, audit active subscriptions, and process gate entries from one visual control plane.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
          <Button
            onClick={() => setActiveView('register')}
            style={{
              background: 'var(--accent-warm)',
              color: 'var(--text-primary)',
              border: 'none',
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 12px rgba(230, 161, 0, 0.2)'
            }}
          >
            Checkout Subscription
          </Button>
        </div>

        {/* Decorative ambient background shape */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '220px',
          height: '220px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          zIndex: 1
        }} />
      </div>

      {/* Metrics Cards Component */}
      <MetricCards
        todaySales={todaySales}
        salesChangePercent={salesChangePercent}
        activeMembersCount={activeMembersCount}
        activeChangePercent={activeChangePercent}
        todayNewMembersCount={todayNewMembersCount}
        newClientsChangePercent={newClientsChangePercent}
        totalSales={totalSales}
        revenueGoalPct={revenueGoalPct}
        capacityGoalPct={capacityGoalPct}
      />

      {/* Graphical Breakdown Row */}
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <PaymentDistribution
          khqrSum={khqrSum}
          cashSum={cashSum}
          cardSum={cardSum}
          khqrPct={khqrPct}
          cashPct={cashPct}
          cardPct={cardPct}
        />
        <PeakTraffic
          slots={slots}
          slotCounts={slotCounts}
          maxSlotCount={maxSlotCount}
        />
      </div>

      {/* Simplified Live Operations feed & quick actions */}
      <div className="purity-grid-3-2">
        <LiveCheckoutStream
          recentPaidTransactions={recentPaidTransactions}
          getMemberName={getMemberName}
        />
        <QuickShortcuts setActiveView={setActiveView} />
      </div>

    </div>
  );
}
