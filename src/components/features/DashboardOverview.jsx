import React from 'react';
import Button from '../ui/Button';
import MetricCards from './dashboard/MetricCards';
import PaymentDistribution from './dashboard/PaymentDistribution';
import MemberDemographics from './dashboard/MemberDemographics';
import PeakTraffic from './dashboard/PeakTraffic';
import LiveCheckoutStream from './dashboard/LiveCheckoutStream';
import QuickShortcuts from './dashboard/QuickShortcuts';

export default function DashboardOverview({
  recentMembers = [],
  payments = [],
  setActiveView,
  onPayPending,
  onViewProfile
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Yesterday's date string for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Helper functions for safe metric extraction
  const isPaymentPaid = (p) => {
    if (!p) return false;
    const st = String(p.status || '').toUpperCase();
    return st === 'PAID' || st === 'COMPLETED' || st === 'SUCCESS';
  };

  const getPaymentAmount = (p) => {
    if (!p) return 0;
    const val = p.finalAmount !== undefined ? p.finalAmount : (p.baseAmount !== undefined ? p.baseAmount : p.amount);
    return Number(val) || 0;
  };

  const isDateToday = (dateStr) => {
    if (!dateStr) return false;
    const str = String(dateStr);
    return str.startsWith(todayStr) || str.includes(todayStr);
  };

  const isDateYesterday = (dateStr) => {
    if (!dateStr) return false;
    const str = String(dateStr);
    return str.startsWith(yesterdayStr) || str.includes(yesterdayStr);
  };

  // 1. Calculations for dynamic dashboard metrics
  const todayPayments = payments.filter(p => isPaymentPaid(p) && isDateToday(p.paymentDate || p.createAt));
  const todaySales = todayPayments.reduce((sum, p) => sum + getPaymentAmount(p), 0);

  const yesterdayPayments = payments.filter(p => isPaymentPaid(p) && isDateYesterday(p.paymentDate || p.createAt));
  const yesterdaySales = yesterdayPayments.reduce((sum, p) => sum + getPaymentAmount(p), 0);

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
    return !m.startDate || !isDateToday(m.startDate);
  }).length;

  let activeChangePercent = 0;
  if (activeMembersYesterday > 0) {
    activeChangePercent = Math.round(((activeMembersCount - activeMembersYesterday) / activeMembersYesterday) * 100);
  }

  // Today's New Clients
  const todayNewMembersCount = recentMembers.filter(m => isDateToday(m.startDate)).length;
  const yesterdayNewMembersCount = recentMembers.filter(m => isDateYesterday(m.startDate)).length;

  let newClientsChangePercent = 0;
  if (yesterdayNewMembersCount > 0) {
    newClientsChangePercent = Math.round(((todayNewMembersCount - yesterdayNewMembersCount) / yesterdayNewMembersCount) * 100);
  } else if (todayNewMembersCount > 0) {
    newClientsChangePercent = 100;
  }

  // Expiring Soon (<7 Days) calculation
  const expiringSoonCount = recentMembers.filter(m => {
    if (!m.endDate || m.endDate === 'N/A' || String(m.status).toUpperCase() !== 'ACTIVE') return false;
    const end = new Date(m.endDate);
    const now = new Date();
    if (isNaN(end.getTime())) return false;
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // All-time Total Revenue
  const paidPayments = payments.filter(isPaymentPaid);
  const totalSales = paidPayments.reduce((sum, p) => sum + getPaymentAmount(p), 0);

  // 2. Gateway distribution data
  const khqrSum = payments.filter(p => isPaymentPaid(p) && String(p.method || '').toUpperCase().includes('KHQR')).reduce((s, p) => s + getPaymentAmount(p), 0);
  const cashSum = payments.filter(p => isPaymentPaid(p) && String(p.method || '').toUpperCase().includes('CASH')).reduce((s, p) => s + getPaymentAmount(p), 0);
  const cardSum = payments.filter(p => isPaymentPaid(p) && (String(p.method || '').toUpperCase().includes('CARD') || String(p.method || '').toUpperCase().includes('CREDIT'))).reduce((s, p) => s + getPaymentAmount(p), 0);
  
  const gatewayTotal = khqrSum + cashSum + cardSum || 1;
  const khqrPct = Math.round((khqrSum / gatewayTotal) * 100);
  const cashPct = Math.round((cashSum / gatewayTotal) * 100);
  const cardPct = Math.round((cardSum / gatewayTotal) * 100);

  // 3. Demographics Calculations
  const activeMembers = recentMembers.filter(m => m.status === 'ACTIVE');
  const totalActiveCount = activeMembers.length;
  
  const genderStats = { male: 0, female: 0, other: 0 };
  const ageStats = { under18: 0, range18_25: 0, range26_35: 0, range36_50: 0, above50: 0 };

  activeMembers.forEach(m => {
    // Gender
    const g = String(m.gender).toUpperCase();
    if (g === 'MALE') {
      genderStats.male++;
    } else if (g === 'FEMALE') {
      genderStats.female++;
    } else {
      genderStats.other++;
    }

    // Age
    if (m.dob && m.dob !== 'N/A') {
      const birthDate = new Date(m.dob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const mMonth = today.getMonth() - birthDate.getMonth();
        if (mMonth < 0 || (mMonth === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          ageStats.under18++;
        } else if (age <= 25) {
          ageStats.range18_25++;
        } else if (age <= 35) {
          ageStats.range26_35++;
        } else if (age <= 50) {
          ageStats.range36_50++;
        } else {
          ageStats.above50++;
        }
      }
    } else {
      // Default to 26-35 if DOB is missing/invalid (conservative default)
      ageStats.range26_35++;
    }
  });

  // 4. Hourly traffic Slots
  const slots = ["08:00", "12:00", "16:00", "18:00", "20:00", "22:00"];
  const slotCounts = Array(slots.length).fill(0);
  recentMembers.forEach(m => {
    const hash = (m.memberID || m.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const slotIdx = hash % slots.length;
    slotCounts[slotIdx]++;
  });
  const maxSlotCount = Math.max(...slotCounts, 1);

  // 5. Live activity feed - Get last 4 completed payments
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '28px 32px',
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
            marginBottom: '8px'
          }}>
            Operational Dashboard
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Cashier Control Center
          </h2>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '6px', maxWidth: '520px', lineHeight: '1.5' }}>
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
              padding: '12px 24px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
            }}
          >
            + Register Member Profile
          </Button>
        </div>

        {/* Decorative ambient background shape */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '220px',
          height: '220px',
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
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: '1fr 1fr 1.2fr', gap: '24px' }}>
        <PaymentDistribution
          khqrSum={khqrSum}
          cashSum={cashSum}
          cardSum={cardSum}
          khqrPct={khqrPct}
          cashPct={cashPct}
          cardPct={cardPct}
        />
        <MemberDemographics
          genderStats={genderStats}
          ageStats={ageStats}
          totalCount={totalActiveCount}
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
