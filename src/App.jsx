import React, { useState, useEffect } from 'react';
import useGymApi from './hooks/useGymApi';
import LoginForm from './components/features/LoginForm';
import MemberForm from './components/features/MemberForm';
import PlanSelection from './components/features/PlanSelection';
import PaymentModal from './components/features/PaymentModal';
import ReceiptCard from './components/features/ReceiptCard';
import RecentMembersList from './components/features/RecentMembersList';
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
    cashier,
    isSimulated,
    isLoading,
    error: apiError,
    login,
    registerMember,
    createMembership,
    confirmPayment,
    commitNewSubscriber,
    logout,
    bypassLogin
  } = useGymApi();

  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Redesign state tracking split workflow
  const [registeredMember, setRegisteredMember] = useState(null);

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

    if (!form.dob) newErrors.dob = 'Date of birth is required';

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

      const response = await registerMember(memberPayload);
      setRegisteredMember(response);
    } catch (err) {
      // Error is caught and displayed through hook error
    } finally {
      setIsFormLoading(false);
    }
  };

  // Step 2: Submit Subscription to API (/api/memberships)
  const handleCreateMembership = async (e) => {
    if (e) e.preventDefault();
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
      // Error is handled
    }
  };

  // Handle gateway recovery switches inside the overlay modal
  const handlePaymentMethodChange = (newMethod) => {
    setPendingSubscription(prev => {
      if (!prev) return null;
      return { ...prev, paymentMethod: newMethod };
    });
    setPaymentError('');
  };

  // Confirm payment success (Step 4 -> process payment API)
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

      // Add record to left/sidebar logs
      commitNewSubscriber(receiptPayload, selectedPlanObj);

      // Advance to success view
      setActiveReceipt(receiptPayload);
      setIsPaymentOpen(false);
      setPendingSubscription(null);
    } catch (err) {
      setPaymentError(err.message || 'Payment authentication failed. Please try again.');
    }
  };

  // Reset workspace
  const handleResetFlow = () => {
    setActiveReceipt(null);
    setRegisteredMember(null);
    setErrors({});
    setForm(prev => ({
      ...DEFAULT_FORM_STATE,
      planID: plans.length > 0 ? String(plans[0].planID) : '',
      startDate: new Date().toISOString().split('T')[0]
    }));
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

  // Live total calculations
  const currentPlan = plans.find(p => String(p.planID) === String(form.planID));
  const basePrice = currentPlan ? Number(currentPlan.planPrice) : 0;
  const finalPrice = Math.max(0, basePrice - (basePrice * (Number(form.discount) || 0)) / 100);

  return (
    <div className="app-shell">
      {/* Left Sidebar Category Menu */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">G</div>
          <div className="sidebar-title">Gym<span>Management</span></div>
        </div>

        <nav className="sidebar-nav">
          <button type="button" className="nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Cashier Terminal
          </button>
          
          <button type="button" className="nav-item" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Members Directory
          </button>
          
          <button type="button" className="nav-item" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Billing Ledger
          </button>
          
          <button type="button" className="nav-item" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Gym Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          Terminal Console v1.0.0
        </div>
      </aside>

      {/* Main Content Workspace Layout */}
      <div className="main-layout">
        {/* Top bar header */}
        <header className="dashboard-header">
          <h2 className="header-title">Cashier Terminal</h2>
          
          <div className="header-meta">
            <div className={`status-badge ${isSimulated ? 'simulated' : 'connected'}`}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isSimulated ? '#64748b' : 'var(--color-success)',
                display: 'inline-block'
              }} />
              {isSimulated ? 'Simulation Active' : 'System Connected'}
            </div>

            <div className="user-info">
              Cashier: <strong>{cashier.name}</strong> | Shift: <strong>{cashier.shift}</strong>
            </div>

            <Button
              variant="ghost"
              onClick={logout}
              style={{ minHeight: '36px', padding: '6px 12px', width: 'auto', fontWeight: 600 }}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Form area grid */}
        <div className="dashboard-grid">
          <div className="workspace-left">
            {activeReceipt ? (
              <ReceiptCard
                receiptData={activeReceipt}
                planDetails={plans.find(p => String(p.planID) === String(activeReceipt.planID))}
                onReset={handleResetFlow}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {apiError && (
                  <div style={{
                    backgroundColor: 'var(--color-error-bg)',
                    border: '1.5px solid var(--color-error)',
                    color: 'var(--color-error)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Server Error: {apiError}
                  </div>
                )}

                {/* Step 1 Component */}
                <MemberForm
                  formData={form}
                  errors={errors}
                  onChange={handleFormChange}
                  onRegister={handleRegisterMember}
                  registeredMember={registeredMember}
                  isLoading={isFormLoading}
                />

                {/* Step 2 Component */}
                <PlanSelection
                  plans={plans}
                  selectedPlanID={form.planID}
                  discount={form.discount}
                  paymentMethod={form.paymentMethod}
                  startDate={form.startDate}
                  errors={errors}
                  onChange={handleFormChange}
                  registeredMember={registeredMember}
                />

                {/* Step 2 process button - only enabled once registeredMember is set */}
                {registeredMember && (
                  <Button
                    type="button"
                    onClick={handleCreateMembership}
                    loading={isLoading}
                    style={{ fontSize: '16px' }}
                  >
                    Create Membership & Process Payment (${finalPrice.toFixed(2)})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Registrations */}
          <div className="workspace-right">
            <RecentMembersList
              members={recentMembers}
              isLoading={isLoading && recentMembers.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal Overlay */}
      {pendingSubscription && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          paymentID={pendingSubscription.paymentID}
          paymentMethod={pendingSubscription.paymentMethod}
          totalAmount={finalPrice}
          memberName={pendingSubscription.memberName}
          onConfirm={handleConfirmPayment}
          onMethodChange={handlePaymentMethodChange}
          isLoading={isLoading}
          error={paymentError}
        />
      )}
    </div>
  );
}
