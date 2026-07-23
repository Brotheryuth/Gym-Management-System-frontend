import React, { useState, useEffect } from 'react';
import useGymApi from './hooks/useGymApi';
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
import { validateField, validateProfileForm, validateBillingForm } from './utils/validation';
import AdminWarningModal from './components/ui/AdminWarningModal';
import './App.css';

const DEFAULT_FORM_STATE = {
  fullName: '',
  phoneNumber: '',
  dob: '',
  gender: 'MALE',
  planID: '',
  discount: '0',
  startDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'KHQR'
};

export default function App() {
  const {
    plans,
    recentMembers,
    members,
    payments,
    cashier,
    isOffline,
    backendStatus,
    retryBackendConnection,
    isLoading,
    error: apiError,
    login,
    registerMember,
    createMembership,
    confirmPayment,
    commitNewSubscriber,
    logout,
    bypassLogin,
    deleteMember,
    updateMember,
    createPlan,
    updatePlan,
    deletePlan,
    cancelMembership,
    refundPayment
  } = useGymApi();

  const [activeView, setActiveView] = useState('dashboard');
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [adminWarningOpen, setAdminWarningOpen] = useState(false);

  // Redesign split workflow state
  const [registeredMember, setRegisteredMember] = useState(null);
  const [editingMemberID, setEditingMemberID] = useState(null);

  // Modal and Receipt step flows
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [profileMember, setProfileMember] = useState(null);
  const [directSubMemberID, setDirectSubMemberID] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const handleSubscribeFromProfile = (member) => {
    const rawId = member.id || member.memberID;
    setProfileMember(null);
    setDirectSubMemberID(String(rawId));
  };

  // Set default planID once plans load
  useEffect(() => {
    if (plans.length > 0 && !form.planID) {
      setForm(prev => ({ ...prev, planID: String(plans[0].planID) }));
    }
  }, [plans]);

  const handleFormChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (['fullName', 'phoneNumber', 'dob', 'discount'].includes(field)) {
        const errMessage = validateField(field, value);
        setErrors(prevErrors => {
          const next = { ...prevErrors };
          if (errMessage) {
            next[field] = errMessage;
          } else {
            delete next[field];
          }
          return next;
        });
      }
      return updated;
    });
  };

  // Step 1: Submit Profile to API (/api/members)
  const handleRegisterMember = async () => {
    setIsFormLoading(true);
    setErrors({});
    
    const profileErrors = validateProfileForm(form);
    if (Object.keys(profileErrors).length > 0) {
      setErrors(profileErrors);
      setIsFormLoading(false);
      return;
    }

    try {
      const memberPayload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        dob: form.dob,
        gender: form.gender
      };

      let response;
      if (editingMemberID) {
        response = await updateMember(editingMemberID, memberPayload);
        setEditingMemberID(null);
      } else {
        response = await registerMember(memberPayload);
      }
      setRegisteredMember(response);
    } catch (err) {
      // API error displays through hook states
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteMember = async (memberID) => {
    if (cashier?.role !== 'ADMIN') {
      setAdminWarningOpen(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete this member profile?')) {
      try {
        await deleteMember(memberID);
      } catch (err) {
        alert('Error deleting member profile: ' + err.message);
      }
    }
  };

  const handleEditMember = (m) => {
    setEditingMemberID(m.memberID);
    setRegisteredMember(null);
    setForm(prev => ({
      ...prev,
      fullName: m.fullName,
      phoneNumber: m.phoneNumber,
      dob: m.dob,
      gender: m.gender
    }));
    setActiveView('register');
  };

  const handlePayPending = (membership) => {
    const payItem = payments.find(p => String(p.membershipID) === String(membership.id) && p.status === 'PENDING');
    if (!payItem) {
      alert('No pending payment record found for this membership.');
      return;
    }
    setPendingSubscription({
      paymentID: payItem.id,
      paymentMethod: payItem.method || 'KHQR',
      memberName: membership.fullName,
      planID: plans.find(p => p.planName === membership.planName)?.planID || (plans[0]?.planID || ''),
      discount: payItem.discount,
      memberID: membership.memberID,
      membershipID: membership.id
    });
    setIsPaymentOpen(true);
  };

  // Step 2: Submit Subscription to API (/api/memberships)
  const handleCreateMembership = async () => {
    setPaymentError('');
    if (!registeredMember) return;
    
    const billingErrors = validateBillingForm(form);
    if (Object.keys(billingErrors).length > 0) {
      setErrors(billingErrors);
      return;
    }

    try {
      const subscriptionPayload = {
        memberID: registeredMember.memberID,
        memberName: registeredMember.fullName,
        planID: form.planID,
        startDate: form.startDate,
        discount: Number(form.discount),
        paymentMethod: form.paymentMethod
      };

      const response = await createMembership(subscriptionPayload);
      setPendingSubscription({
        ...response,
        phoneNumber: registeredMember.phoneNumber,
        dob: registeredMember.dob,
        gender: registeredMember.gender
      });
      setIsPaymentOpen(true);
    } catch (err) {
      // Error is caught and displayed through hook error
    }
  };

  // Direct subscription creation callback (decoupled from step-by-step wizard)
  const handleCreateSubscriptionDirect = async (payload) => {
    setPaymentError('');
    try {
      const response = await createMembership(payload);
      
      const activePlan = plans.find(p => String(p.planID) === String(payload.planID));
      const basePrice = activePlan ? Number(activePlan.planPrice) : 0;
      const calculatedFinalPrice = Math.max(0, basePrice - (basePrice * (Number(payload.discount) || 0)) / 100);

      setPendingSubscription({
        ...response,
        memberName: payload.memberName,
        finalPriceOverride: calculatedFinalPrice
      });
      setIsPaymentOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to create subscription');
    }
  };


  // Switch payment method inside payment modal
  const handlePaymentMethodChange = (newMethod) => {
    setPendingSubscription(prev => {
      if (!prev) return null;
      return { ...prev, paymentMethod: newMethod };
    });
    setPaymentError('');
  };

  // Step 4: Confirm Payment Successful
  const handleConfirmPayment = async () => {
    if (!pendingSubscription) return;
    setPaymentError('');

    try {
      await confirmPayment(pendingSubscription.paymentID, pendingSubscription.paymentMethod);
      
      const selectedPlanObj = plans.find(p => String(p.planID) === String(pendingSubscription.planID));
      const basePrice = selectedPlanObj ? Number(selectedPlanObj.planPrice) : 0;
      const finalAmount = Math.max(0, basePrice - (basePrice * Number(pendingSubscription.discount)) / 100);

      const receiptPayload = {
        ...pendingSubscription,
        finalAmount,
        startDate: form.startDate
      };

      // Push into recent list database
      commitNewSubscriber(receiptPayload, selectedPlanObj);

      // Advance to success view
      setActiveReceipt(receiptPayload);
      setIsPaymentOpen(false);
      setPendingSubscription(null);
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Card declined or terminal error.');
    }
  };

  // Reset workflow and return to landing dashboard
  const handleResetFlow = () => {
    setActiveReceipt(null);
    setRegisteredMember(null);
    setEditingMemberID(null);
    setErrors({});
    setForm(prev => ({
      ...DEFAULT_FORM_STATE,
      planID: plans.length > 0 ? String(plans[0].planID) : '',
      startDate: new Date().toISOString().split('T')[0]
    }));
    setActiveView('dashboard');
  };

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
        <Header
          activeView={activeView}
          isOffline={isOffline}
          cashier={cashier}
          logout={logout}
        />

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
              } catch (err) {
                alert('Error canceling membership: ' + err.message);
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
              } catch (err) {
                alert('Error refunding payment: ' + err.message);
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
        <Modal
          isOpen={!!activeReceipt}
          title="Payment Receipt"
          onClose={handleResetFlow}
        >
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

      <AdminWarningModal
        isOpen={adminWarningOpen}
        onClose={() => setAdminWarningOpen(false)}
      />
    </div>
  );
}
