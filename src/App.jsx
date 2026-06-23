import React, { useState, useEffect } from 'react';
import useGymApi from './hooks/useGymApi';
import LoginForm from './components/features/LoginForm';
import MemberForm from './components/features/MemberForm';
import PlanSelection from './components/features/PlanSelection';
import PaymentModal from './components/features/PaymentModal';
import ReceiptCard from './components/features/ReceiptCard';
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

  const [activeView, setActiveView] = useState('dashboard');
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Redesign split workflow state
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
      // API error displays through hook states
    } finally {
      setIsFormLoading(false);
    }
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
      {/* Redesigned Left Sidebar - Crisp light energy theme */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">G</div>
          <div className="sidebar-title">Gym<span>Management</span></div>
        </div>

        <nav className="sidebar-nav">
          <button 
            type="button" 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard Overview
          </button>
          
          <button 
            type="button" 
            className={`nav-item ${activeView === 'register' ? 'active' : ''}`}
            onClick={() => setActiveView('register')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
            Register Member
          </button>
          
          <button type="button" className="nav-item" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Billing Ledger
          </button>
          
          <button type="button" className="nav-item" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
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

      {/* Main Workspace Layout */}
      <div className="main-layout">
        {/* Header bar */}
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

        {/* Dynamic Landing Panels based on activeView state */}
        {activeView === 'dashboard' ? (
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="workspace-left">
              {/* Summary Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div>
                    <div className="stat-label">Active Members</div>
                    <div className="stat-value">{recentMembers.length + 142}</div>
                  </div>
                  <div className="stat-icon-wrapper" style={{ color: 'var(--accent-indigo)', backgroundColor: 'var(--accent-indigo-light)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-label">Shift Sales</div>
                    <div className="stat-value">$1,420.00</div>
                  </div>
                  <div className="stat-icon-wrapper" style={{ color: 'var(--accent-teal)', backgroundColor: 'var(--accent-teal-light)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <div className="stat-label">Active Gateway</div>
                    <div className="stat-value">KHQR Active</div>
                  </div>
                  <div className="stat-icon-wrapper" style={{ color: 'var(--accent-orange)', backgroundColor: 'var(--accent-orange-light)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Command Welcome Card with Direct Registration Button */}
              <div className="command-center-box">
                <div className="command-info-group">
                  <h3>Welcome to the Cashier Dashboard</h3>
                  <p>Process customer entries, track transaction totals, and create memberships.</p>
                </div>
                
                <Button
                  onClick={() => setActiveView('register')}
                  style={{ width: 'auto', minWidth: '200px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="17" y1="11" x2="23" y2="11"></line>
                  </svg>
                  Register Member
                </Button>
              </div>

              {/* Database List Table */}
              <div className="dashboard-table-card">
                <div className="table-title-area">
                  <h3 className="table-title">Recent Gym Registrations</h3>
                </div>
                
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Member Name</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Plan Name</th>
                        <th>Account Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMembers.map((m) => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 700 }}>{m.fullName}</td>
                          <td>{m.phoneNumber}</td>
                          <td>{m.gender}</td>
                          <td>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {m.planName}
                            </span>
                          </td>
                          <td>
                            <span className="member-status-tag">{m.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="workspace-left">
              {/* Back CTA Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                <Button 
                  variant="secondary"
                  onClick={handleResetFlow}
                  style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
                >
                  Back to Dashboard
                </Button>
              </div>

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

                  {/* Step 1 Profile registration */}
                  <MemberForm
                    formData={form}
                    errors={errors}
                    onChange={handleFormChange}
                    onRegister={handleRegisterMember}
                    registeredMember={registeredMember}
                    isLoading={isFormLoading}
                  />

                  {/* Step 2 Billing setup */}
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

                  {/* Step 2 Checkout activation button */}
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

            {/* Sidebar list logs preview */}
            <div className="workspace-right" style={{ paddingTop: activeReceipt ? '0' : '46px' }}>
              <RecentMembersList
                members={recentMembers}
                isLoading={isLoading && recentMembers.length === 0}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
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
