import React from 'react';
import Button from '../ui/Button';
import MetricCards from './dashboard/MetricCards';
import PaymentDistribution from './dashboard/PaymentDistribution';
import MemberDemographics from './dashboard/MemberDemographics';
import PeakTraffic from './dashboard/PeakTraffic';
import LiveCheckoutStream from './dashboard/LiveCheckoutStream';
import QuickShortcuts from './dashboard/QuickShortcuts';
import PlanPopularityRings from './dashboard/PlanPopularityRings';
import { calculateDashboardMetrics } from '../../utils/dashboardHelpers';

export default function DashboardOverview({
  recentMembers = [],
  payments = [],
  plans = [],
  setActiveView,
  onPayPending,
  onViewProfile,
  onSelectPlanFilter
}) {
  const {
    todaySales,
    salesChangePercent,
    activeMembersCount,
    activeChangePercent,
    todayNewMembersCount,
    newClientsChangePercent,
    expiringSoonCount,
    totalSales,
    khqrSum,
    cashSum,
    cardSum,
    khqrPct,
    cashPct,
    cardPct,
    genderStats,
    ageStats,
    totalActiveCount,
    slots,
    slotCounts,
    maxSlotCount,
    recentPaidTransactions,
    getMemberName,
    revenueGoalPct,
    capacityGoalPct
  } = calculateDashboardMetrics(recentMembers, payments);

  return (
    <div className="dashboard-overview-container">
      
      {/* Welcome & Command Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '22px 28px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: 'var(--brand-primary)', 
            backgroundColor: 'rgba(234, 88, 12, 0.15)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-round)',
            textTransform: 'uppercase', 
            letterSpacing: '1.2px',
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            Operational Dashboard
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', letterSpacing: '-0.4px', margin: 0 }}>
            Cashier Control Center
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', maxWidth: '540px', lineHeight: '1.45', margin: 0 }}>
            Monitor real-time payments, audit active subscriptions, and process gate entries from one visual control plane.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', zIndex: 2 }}>
          <Button
            onClick={() => setActiveView('register')}
            style={{
              background: 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              padding: '10px 20px',
              fontSize: '13px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
            }}
          >
            + Register Member Profile
          </Button>
        </div>

        {/* Decorative ambient background shape */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
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
        expiringSoonCount={expiringSoonCount}
      />

      {/* Graphical Breakdown Row */}
      <div className="purity-grid-2-3" style={{ gap: '20px', alignItems: 'stretch' }}>
        {/* Column 1: Peak Attendance Traffic */}
        <PeakTraffic
          slots={slots}
          slotCounts={slotCounts}
          maxSlotCount={maxSlotCount}
        />

        {/* Column 2: Member Demographics */}
        <MemberDemographics
          genderStats={genderStats}
          ageStats={ageStats}
          totalCount={totalActiveCount}
        />

        {/* Column 3: Stacked Payment Distribution + Plan Popularity Ring Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <PaymentDistribution
            khqrSum={khqrSum}
            cashSum={cashSum}
            cardSum={cardSum}
            khqrPct={khqrPct}
            cashPct={cashPct}
            cardPct={cardPct}
          />
          <PlanPopularityRings
            recentMembers={recentMembers}
            plans={plans}
            onSelectPlan={(planName) => {
              if (onSelectPlanFilter) onSelectPlanFilter(planName);
              setActiveView('memberships');
            }}
          />
        </div>
      </div>

      {/* Simplified Live Operations feed & quick actions (Below the fold) */}
      <div className="purity-grid-3-2" style={{ gap: '20px', alignItems: 'start', marginTop: '4px' }}>
        <LiveCheckoutStream
          recentPaidTransactions={recentPaidTransactions}
          getMemberName={getMemberName}
        />
        <QuickShortcuts setActiveView={setActiveView} />
      </div>

    </div>
  );
}
