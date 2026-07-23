import React, { useState } from 'react';
import useGymApi from './hooks/useGymApi';
import useAppWorkflow from './hooks/useAppWorkflow';
import { useToast } from './context/ToastContext';
import { formatErrorMessage } from './utils/errorFormatter';
import LoginForm from './components/features/LoginForm';
import PaymentModal from './components/features/PaymentModal';
import ReceiptCard from './components/features/ReceiptCard';
import MemberProfileModal from './components/features/MemberProfileModal';
import MembershipFormModal from './components/features/MembershipFormModal';
import Modal from './components/ui/Modal';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/features/DashboardOverview';
import RegistrationWorkflow from './components/features/RegistrationWorkflow';
import MemberManagement from './components/features/MemberManagement';
import MembershipManagement from './components/features/MembershipManagement';
import PlanManagement from './components/features/PlanManagement';
import BillingLedger from './components/features/BillingLedger';
import AdminWarningModal from './components/ui/AdminWarningModal';
import './App.css';

export default function App() {
  const toast = useToast();
  const {
    plans, recentMembers, members, payments, cashier, isOffline,
    backendStatus, retryBackendConnection, isLoading, error: apiError,
    login, registerMember, createMembership, confirmPayment, commitNewSubscriber,
    logout, bypassLogin, deleteMember, updateMember, createPlan, updatePlan, deletePlan,
    cancelMembership, refundPayment
  } = useGymApi();

  const [activeView, setActiveView] = useState('dashboard');

  const {
    form, errors, isFormLoading, adminWarningOpen, setAdminWarningOpen,
    registeredMember, editingMemberID, isPaymentOpen, setIsPaymentOpen,
    pendingSubscription, activeReceipt, profileMember, setProfileMember,
    directSubMemberID, setDirectSubMemberID, paymentError,
    handleFormChange, handleRegisterMember, handleDeleteMember, handleEditMember,
    handlePayPending, handleCreateMembership, handleCreateSubscriptionDirect,
    handlePaymentMethodChange, handleConfirmPayment, handleResetFlow, handleSubscribeFromProfile
  } = useAppWorkflow({
    plans, payments, cashier, registerMember, updateMember, deleteMember,
    createMembership, confirmPayment, commitNewSubscriber, setActiveView
  });

  if (!cashier) {
    return (
      <LoginForm
        onLogin={login}
        onBypass={bypassLogin}
        isLoading={isLoading}
        error={apiError}
        backendStatus={backendStatus}
        onRetryBackend={retryBackendConnection}
      />
    );
  }

  const currentPlan = plans.find(p => String(p.planID) === String(form.planID));
  const basePrice = currentPlan ? Number(currentPlan.planPrice) : 0;
  const finalPrice = Math.max(0, basePrice - (basePrice * (Number(form.discount) || 0)) / 100);

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="main-layout">
        <Header activeView={activeView} isOffline={isOffline} cashier={cashier} logout={logout} />

        {activeView === 'dashboard' && (
          <DashboardOverview
            recentMembers={recentMembers}
            payments={payments}
            plans={plans}
            setActiveView={setActiveView}
            onDeleteMember={handleDeleteMember}
            onEditMember={handleEditMember}
            onPayPending={handlePayPending}
            onViewProfile={setProfileMember}
          />
        )}

        {activeView === 'register' && (
          <RegistrationWorkflow
            form={form}
            errors={errors}
            handleFormChange={handleFormChange}
            handleRegisterMember={handleRegisterMember}
            registeredMember={registeredMember}
            isFormLoading={isFormLoading}
            plans={plans}
            handleCreateMembership={handleCreateMembership}
            isLoading={isLoading}
            finalPrice={finalPrice}
            activeReceipt={activeReceipt}
            handleResetFlow={handleResetFlow}
            recentMembers={recentMembers}
            apiError={apiError}
            isEditing={!!editingMemberID}
            onViewProfile={setProfileMember}
          />
        )}

        {activeView === 'members' && (
          <MemberManagement
            members={members}
            recentMembers={recentMembers}
            plans={plans}
            onRegisterMember={registerMember}
            onUpdateMember={updateMember}
            onDeleteMember={handleDeleteMember}
            onViewProfile={setProfileMember}
            onSubscribeMember={handleSubscribeFromProfile}
            cashier={cashier}
            onShowAdminWarning={() => setAdminWarningOpen(true)}
          />
        )}

        {activeView === 'memberships' && (
          <MembershipManagement
            recentMembers={recentMembers}
            members={members}
            plans={plans}
            onCreateMembership={handleCreateSubscriptionDirect}
            onPayPending={handlePayPending}
            onViewProfile={setProfileMember}
            onCancelMembership={async (id) => {
              try {
                await cancelMembership(id);
                toast.success('Membership subscription canceled.');
              } catch (err) {
                toast.error(formatErrorMessage(err));
              }
            }}
            cashier={cashier}
            onShowAdminWarning={() => setAdminWarningOpen(true)}
          />
        )}

        {activeView === 'plans' && (
          <PlanManagement
            plans={plans}
            recentMembers={recentMembers}
            onCreatePlan={createPlan}
            onUpdatePlan={updatePlan}
            onDeletePlan={deletePlan}
            cashier={cashier}
            onShowAdminWarning={() => setAdminWarningOpen(true)}
          />
        )}

        {activeView === 'payments' && (
          <BillingLedger
            payments={payments}
            recentMembers={recentMembers}
            onRefundPayment={async (id) => {
              try {
                await refundPayment(id);
                toast.success('Payment transaction refunded successfully.');
              } catch (err) {
                toast.error(formatErrorMessage(err));
              }
            }}
            cashier={cashier}
            onShowAdminWarning={() => setAdminWarningOpen(true)}
          />
        )}
      </div>

      {pendingSubscription && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          paymentID={pendingSubscription.paymentID}
          paymentMethod={pendingSubscription.paymentMethod}
          totalAmount={pendingSubscription.finalPriceOverride !== undefined ? pendingSubscription.finalPriceOverride : finalPrice}
          memberName={pendingSubscription.memberName}
          onConfirm={handleConfirmPayment}
          onMethodChange={handlePaymentMethodChange}
          isLoading={isLoading}
          error={paymentError}
        />
      )}

      {activeReceipt && (
        <Modal isOpen={!!activeReceipt} title="Payment Receipt" onClose={handleResetFlow}>
          <ReceiptCard
            receiptData={activeReceipt}
            planDetails={plans.find(p => String(p.planID) === String(activeReceipt.planID))}
            onReset={handleResetFlow}
          />
        </Modal>
      )}

      {profileMember && (
        <MemberProfileModal
          isOpen={!!profileMember}
          onClose={() => setProfileMember(null)}
          member={profileMember}
          recentMembers={recentMembers}
          payments={payments}
          onSubscribeMember={handleSubscribeFromProfile}
        />
      )}

      {directSubMemberID && (
        <MembershipFormModal
          isOpen={!!directSubMemberID}
          onClose={() => setDirectSubMemberID(null)}
          onSubmit={async (payload) => {
            await handleCreateSubscriptionDirect(payload);
            setDirectSubMemberID(null);
          }}
          members={members}
          plans={plans}
          initialMemberID={directSubMemberID}
          isLoading={isLoading}
        />
      )}

      <AdminWarningModal isOpen={adminWarningOpen} onClose={() => setAdminWarningOpen(false)} />
    </div>
  );
}
