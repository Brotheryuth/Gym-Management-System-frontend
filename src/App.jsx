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
    createSubscription,
    confirmPayment,
    commitNewSubscriber,
    logout,
    bypassLogin
  } = useGymApi();

  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

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
  const validateField = (field, value, currentForm) => {
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
        errMessage = 'Enter a valid digits sequence (9 to 11 numbers)';
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
      // Only do real-time checks for form inputs (Step 1 and Step 2 fields)
      if (['fullName', 'phoneNumber', 'dob', 'discount'].includes(field)) {
        validateField(field, value, updated);
      }
      return updated;
    });
  };

  // Validate the whole form before step 3
  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (form.fullName.trim().length > 0 && form.fullName.trim().length < 2) newErrors.fullName = 'Name is too short';
    
    const phoneRegex = /^\d{9,11}$/;
    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(form.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be between 9 and 11 digits';
    }

    if (!form.dob) newErrors.dob = 'Date of birth is required';
    
    const discountVal = Number(form.discount);
    if (isNaN(discountVal) || discountVal < 0 || discountVal > 100) {
      newErrors.discount = 'Discount range is 0 to 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission (Step 1 & 2 -> Submit to API)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitAttempted(true);
    setPaymentError('');

    if (!validateForm()) return;

    try {
      const memberPayload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        dob: form.dob,
        gender: form.gender
      };

      const subscriptionPayload = {
        planID: form.planID,
        startDate: form.startDate,
        discount: Number(form.discount),
        paymentMethod: form.paymentMethod
      };

      const response = await createSubscription(memberPayload, subscriptionPayload);
      
      // Store response details & launch interactive payment overlay
      setPendingSubscription({
        ...response,
        phoneNumber: form.phoneNumber,
        dob: form.dob,
        gender: form.gender
      });
      setIsPaymentOpen(true);
    } catch (err) {
      // API error shows automatically in hook state or local toast
    }
  };

  // Handle Dynamic Payment Method Changes *on-the-fly* inside the modal
  const handlePaymentMethodChange = (newMethod) => {
    setPendingSubscription(prev => {
      if (!prev) return null;
      return { ...prev, paymentMethod: newMethod };
    });
    setPaymentError('');
  };

  // Handle Confirm Payment (Step 4 -> process payment API)
  const handleConfirmPayment = async () => {
    if (!pendingSubscription) return;
    setPaymentError('');

    try {
      await confirmPayment(pendingSubscription.paymentID, pendingSubscription.paymentMethod);
      
      // Compute final pricing details
      const selectedPlanObj = plans.find(p => String(p.planID) === String(pendingSubscription.planID));
      const basePrice = selectedPlanObj ? Number(selectedPlanObj.planPrice) : 0;
      const finalAmount = Math.max(0, basePrice - (basePrice * Number(pendingSubscription.discount)) / 100);

      const receiptPayload = {
        ...pendingSubscription,
        finalAmount,
        startDate: form.startDate
      };

      // Instantly inject into recent members feed (State persistence / DRY)
      commitNewSubscriber(receiptPayload, selectedPlanObj);

      // Transition to Success & Receipt screen
      setActiveReceipt(receiptPayload);
      setIsPaymentOpen(false);
      setPendingSubscription(null);
    } catch (err) {
      setPaymentError(err.message || 'Payment authentication failed. Please try again.');
    }
  };

  // Reset work space for next cashier workflow (Step 5 -> reset)
  const handleResetFlow = () => {
    setActiveReceipt(null);
    setIsSubmitAttempted(false);
    setErrors({});
    setForm(prev => ({
      ...DEFAULT_FORM_STATE,
      planID: plans.length > 0 ? String(plans[0].planID) : '',
      startDate: new Date().toISOString().split('T')[0]
    }));
  };

  // Render Login page if not authenticated
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

  // Look up selected plan data to show pricing
  const currentPlan = plans.find(p => String(p.planID) === String(form.planID));
  const basePrice = currentPlan ? Number(currentPlan.planPrice) : 0;
  const finalPrice = Math.max(0, basePrice - (basePrice * (Number(form.discount) || 0)) / 100);

  return (
    <div className="app-container">
      {/* Header section */}
      <header className="dashboard-header">
        <div className="brand-section">
          <div className="brand-logo-glow">G</div>
          <div className="brand-title">Gym<span>Management</span></div>
        </div>
        
        <div className="header-meta">
          <div className={`status-badge ${isSimulated ? 'simulated' : 'connected'}`}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isSimulated ? 'var(--accent-orange)' : 'var(--color-success)',
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

      {/* Main workspace */}
      <main className="dashboard-grid">
        <div className="workspace-left">
          {activeReceipt ? (
            <ReceiptCard
              receiptData={activeReceipt}
              planDetails={plans.find(p => String(p.planID) === String(activeReceipt.planID))}
              onReset={handleResetFlow}
            />
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
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
                  🚨 Server Error: {apiError}
                </div>
              )}

              {/* Step 1 Component */}
              <MemberForm
                formData={form}
                errors={errors}
                onChange={handleFormChange}
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
              />

              {/* Checkout activation button */}
              <Button
                type="submit"
                loading={isLoading}
                style={{ fontSize: '16px' }}
              >
                Register Member & Process payment (${finalPrice.toFixed(2)})
              </Button>
            </form>
          )}
        </div>

        {/* Recent member logs sidebar */}
        <div className="workspace-right">
          <RecentMembersList
            members={recentMembers}
            isLoading={isLoading && recentMembers.length === 0}
          />
        </div>
      </main>

      {/* Steps 3 & 4 Interactive overlay modal */}
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
