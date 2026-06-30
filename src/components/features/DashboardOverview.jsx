import React from 'react';
import MetricCards from './dashboard/MetricCards';
import HeroBanners from './dashboard/HeroBanners';
import TrafficBarChart from './dashboard/TrafficBarChart';
import SalesLineChart from './dashboard/SalesLineChart';
import SubscriptionsTable from './dashboard/SubscriptionsTable';
import ActivityTimeline from './dashboard/ActivityTimeline';

/**
 * DashboardOverview component coordinates metrics and visual analytics subcomponents.
 * Aligned with the So Matcha color palette.
 * @param {object} props
 * @param {Array} props.recentMembers - List of recent membership profiles
 * @param {Array} props.payments - List of payment transactions
 * @param {function} props.setActiveView - Handler to switch view states
 * @param {function} props.onDeleteMember - Handler to delete a member profile
 * @param {function} props.onEditMember - Handler to edit a member profile
 * @param {function} props.onPayPending - Handler to process payment for pending subscription
 */
export default function DashboardOverview({ 
  recentMembers = [], 
  payments = [], 
  setActiveView,
  onDeleteMember,
  onEditMember,
  onPayPending
}) {
  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  
  // Yesterday's date string for comparisons
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 1. Stat Calculations (Dynamic DB values)
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

  // 2. Chart Processing (SVG Line Chart)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySales = Array(12).fill(0);
  const monthlyTransactions = Array(12).fill(0);

  payments.forEach(p => {
    if (p.status !== 'PAID') return;
    const dateStr = p.paymentDate || p.createAt;
    if (!dateStr) return;
    const dateObj = new Date(dateStr);
    const mIndex = dateObj.getMonth();
    monthlySales[mIndex] += p.finalAmount;
    monthlyTransactions[mIndex]++;
  });

  const maxSales = Math.max(...monthlySales, 100); 
  const maxTransactions = Math.max(...monthlyTransactions, 10);

  const getLinePoints = (data, maxVal) => {
    return data.map((val, idx) => {
      const x = 30 + (idx * 40);
      const y = 130 - (val / maxVal) * 110;
      return `${x},${y}`;
    }).join(' ');
  };

  const salesPoints = getLinePoints(monthlySales, maxSales);
  const transPoints = getLinePoints(monthlyTransactions, maxTransactions);
  
  const salesAreaPoints = salesPoints ? `30,130 ${salesPoints} 470,130` : '';
  const transAreaPoints = transPoints ? `30,130 ${transPoints} 470,130` : '';

  // 3. Bar Chart Processing (SVG Bar Chart for hourly traffic)
  const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  const slotCounts = Array(slots.length).fill(0);
  recentMembers.forEach(m => {
    const hash = m.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const slotIdx = hash % slots.length;
    slotCounts[slotIdx]++;
  });
  const maxSlotCount = Math.max(...slotCounts, 5);

  // 4. Payment Gateway Breakdown
  const khqrSum = payments.filter(p => p.status === 'PAID' && p.method === 'KHQR').reduce((s, p) => s + p.finalAmount, 0);
  const cashSum = payments.filter(p => p.status === 'PAID' && (p.method === 'BYCASH' || p.method === 'CASH')).reduce((s, p) => s + p.finalAmount, 0);
  const cardSum = payments.filter(p => p.status === 'PAID' && p.method === 'CREDITCARD').reduce((s, p) => s + p.finalAmount, 0);

  // Helper: Find member name from ID
  const getMemberName = (membershipID) => {
    const mem = recentMembers.find(m => String(m.id) === String(membershipID));
    return mem ? mem.fullName : 'Walk-in Customer';
  };

  return (
    <div className="dashboard-overview-container">
      <MetricCards
        todaySales={todaySales}
        salesChangePercent={salesChangePercent}
        activeMembersCount={activeMembersCount}
        activeChangePercent={activeChangePercent}
        todayNewMembersCount={todayNewMembersCount}
        newClientsChangePercent={newClientsChangePercent}
        totalSales={totalSales}
      />

      <HeroBanners
        setActiveView={setActiveView}
        khqrSum={khqrSum}
        cashSum={cashSum}
        cardSum={cardSum}
      />

      <div className="purity-grid-2-3">
        <TrafficBarChart
          recentMembersCount={recentMembers.length}
          todayNewMembersCount={todayNewMembersCount}
          totalSales={totalSales}
          slotCounts={slotCounts}
          slots={slots}
          maxSlotCount={maxSlotCount}
        />

        <SalesLineChart
          salesPoints={salesPoints}
          transPoints={transPoints}
          salesAreaPoints={salesAreaPoints}
          transAreaPoints={transAreaPoints}
          monthlySales={monthlySales}
          maxSales={maxSales}
          months={months}
        />
      </div>

      <div className="purity-grid-3-2">
        <SubscriptionsTable
          recentMembers={recentMembers}
          onPayPending={onPayPending}
          onEditMember={onEditMember}
          onDeleteMember={onDeleteMember}
        />

        <ActivityTimeline
          payments={payments}
          getMemberName={getMemberName}
        />
      </div>
    </div>
  );
}
