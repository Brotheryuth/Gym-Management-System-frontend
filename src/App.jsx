import React, { useState, useEffect } from 'react';
import useGymApi from './hooks/useGymApi';
import LoginForm from './components/features/LoginForm';
import PaymentModal from './components/features/PaymentModal';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/features/DashboardOverview';
import RegistrationWorkflow from './components/features/RegistrationWorkflow';
import MemberManagement from './components/features/MemberManagement';
import MembershipManagement from './components/features/MembershipManagement';
import PlanManagement from './components/features/PlanManagement';
import BillingLedger from './components/features/BillingLedger';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
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
  const [paymentError, setPaymentError] = useState('');

  // Set default planID once plans load
  useEffect(() => {
    if (plans.length > 0 && !form.planID) {
      setForm(prev => ({ ...prev, planID: String(plans[0].planID) }));
    }
  }, [plans]);

  // Real-time single field validation
  const validateField = (field, value) => {
    let errMessage = '';
    
    if (field === 'fullName') {
      if (!value.trim()) {
        errMessage = 'Full name is required';
      } else if (value.trim().length < 2) {
        errMessage = 'Name must be at least 2 characters long';
      }
    }

    if (field === 'phoneNumber') {
      const cleanPhone = value.replace(/\s+/g, '');
      const phoneRegex = /^\d{9,11}$/;
      if (!cleanPhone) {
        errMessage = 'Phone number is required';
      } else if (!phoneRegex.test(cleanPhone)) {
        errMessage = 'Enter a valid digit sequence (9 to 11 numbers)';
      }
    }

    if (field === 'dob') {
      if (!value) {
        errMessage = 'Date of birth is required';
      } else {
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) {
          errMessage = 'Date of birth cannot be in the future';
        }
      }
    }

    if (field === 'discount') {
      const val = Number(value);
      if (isNaN(val) || val < 0 || val > 100) {
        errMessage = 'Discount must be between 0% and 100%';
      }
    }

    setErrors(prev => {
      const next = { ...prev };
      if (errMessage) {
        next[field] = errMessage;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleFormChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (['fullName', 'phoneNumber', 'dob', 'discount'].includes(field)) {
        validateField(field, value);
      }
      return updated;
    });
  };

  // Validate Step 1 Profile Fields
  const validateProfileForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (form.fullName.trim().length > 0 && form.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters long';
    }
    
    const phoneRegex = /^\d{9,11}$/;
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(form.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be between 9 and 11 digits';
    }

    if (!form.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(form.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 12) {
        newErrors.dob = 'Member must be at least 12 years old (verify Date of Birth is correct)';
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2 Billing Fields
  const validateBillingForm = () => {
    const newErrors = {};
    if (!form.planID) newErrors.planID = 'Please select a gym plan';
    
    const discountVal = Number(form.discount);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    if (!form.paymentMethod) newErrors.paymentMethod = 'Please select a gateway';

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Submit Profile to API (/api/members)
  const handleRegisterMember = async () => {
    setIsFormLoading(true);
    setErrors({});
    if (!validateProfileForm()) {
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
    if (!validateBillingForm()) return;

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
            setActiveView={setActiveView}
            onDeleteMember={handleDeleteMember}
            onEditMember={handleEditMember}
            onPayPending={handlePayPending}
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
          />
        )}

        {activeView === 'members' && (
          <MemberManagement
            members={members}
            onRegisterMember={registerMember}
            onUpdateMember={updateMember}
            onDeleteMember={handleDeleteMember}
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

      <Modal
        isOpen={adminWarningOpen}
        title="Access Restricted"
        onClose={() => setAdminWarningOpen(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Admin Permission Required</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', marginBottom: '24px', lineHeight: 1.5 }}>
            This administrative operation is restricted. Please request assistance from your manager or log in with an Administrator profile to proceed.
          </p>
          <Button
            onClick={() => setAdminWarningOpen(false)}
            style={{ width: '100%' }}
          >
            Acknowledge
          </Button>
        </div>
      </Modal>
    </div>
  );
}
