import { useState, useEffect } from 'react';
import { validateField, validateProfileForm, validateBillingForm } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { formatErrorMessage } from '../utils/errorFormatter';

export const DEFAULT_FORM_STATE = {
  fullName: '',
  phoneNumber: '',
  dob: '',
  gender: 'MALE',
  planID: '',
  discount: '0',
  startDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'KHQR'
};

export default function useAppWorkflow({
  plans,
  payments,
  cashier,
  registerMember,
  updateMember,
  deleteMember,
  createMembership,
  confirmPayment,
  commitNewSubscriber,
  setActiveView
}) {
  const toast = useToast();
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [adminWarningOpen, setAdminWarningOpen] = useState(false);

  const [registeredMember, setRegisteredMember] = useState(null);
  const [editingMemberID, setEditingMemberID] = useState(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [profileMember, setProfileMember] = useState(null);
  const [directSubMemberID, setDirectSubMemberID] = useState(null);
  const [paymentError, setPaymentError] = useState('');

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
          if (errMessage) next[field] = errMessage;
          else delete next[field];
          return next;
        });
      }
      return updated;
    });
  };

  const handleRegisterMember = async () => {
    setIsFormLoading(true);
    setErrors({});
    
    const profileErrors = validateProfileForm(form);
    if (Object.keys(profileErrors).length > 0) {
      setErrors(profileErrors);
      setIsFormLoading(false);
      toast.error('Please fix the validation errors in the form.');
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
        toast.success(`Member "${response.fullName}" updated successfully.`);
      } else {
        response = await registerMember(memberPayload);
        toast.success(`Member profile created for "${response.fullName}".`);
      }
      setRegisteredMember(response);
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setIsFormLoading(false);
    }
  };

  const [deletingMemberItem, setDeletingMemberItem] = useState(null);

  const handleDeleteMember = (memberID, memberName) => {
    if (cashier?.role !== 'ADMIN') {
      setAdminWarningOpen(true);
      return;
    }
    setDeletingMemberItem({ id: memberID, name: memberName || `Member #${memberID}` });
  };

  const handleConfirmDeleteMember = async () => {
    if (!deletingMemberItem) return;
    try {
      await deleteMember(deletingMemberItem.id);
      toast.success('Member profile deleted successfully.');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setDeletingMemberItem(null);
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
      toast.warning('No pending payment record found for this membership.');
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

  const handleCreateMembership = async () => {
    setPaymentError('');
    if (!registeredMember) return;
    
    const billingErrors = validateBillingForm(form);
    if (Object.keys(billingErrors).length > 0) {
      setErrors(billingErrors);
      toast.error('Please fix billing selection errors.');
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
      toast.error(formatErrorMessage(err));
    }
  };

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
      toast.error(formatErrorMessage(err));
    }
  };

  const handlePaymentMethodChange = (newMethod) => {
    setPendingSubscription(prev => {
      if (!prev) return null;
      return { ...prev, paymentMethod: newMethod };
    });
    setPaymentError('');
  };

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

      commitNewSubscriber(receiptPayload, selectedPlanObj);
      setActiveReceipt(receiptPayload);
      setIsPaymentOpen(false);
      setPendingSubscription(null);
      toast.success('Payment confirmed and subscription activated!');
    } catch (err) {
      const formattedErr = formatErrorMessage(err);
      setPaymentError(formattedErr);
      toast.error(formattedErr);
    }
  };

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
    if (setActiveView) {
      setActiveView('dashboard');
    }
  };

  const handleSubscribeFromProfile = (member) => {
    const rawId = member.id || member.memberID;
    setProfileMember(null);
    setDirectSubMemberID(String(rawId));
  };

  return {
    form,
    setForm,
    errors,
    setErrors,
    isFormLoading,
    adminWarningOpen,
    setAdminWarningOpen,
    registeredMember,
    editingMemberID,
    isPaymentOpen,
    setIsPaymentOpen,
    pendingSubscription,
    activeReceipt,
    profileMember,
    setProfileMember,
    directSubMemberID,
    setDirectSubMemberID,
    paymentError,
    deletingMemberItem,
    setDeletingMemberItem,
    handleConfirmDeleteMember,
    handleFormChange,
    handleRegisterMember,
    handleDeleteMember,
    handleEditMember,
    handlePayPending,
    handleCreateMembership,
    handleCreateSubscriptionDirect,
    handlePaymentMethodChange,
    handleConfirmPayment,
    handleResetFlow,
    handleSubscribeFromProfile
  };
}
