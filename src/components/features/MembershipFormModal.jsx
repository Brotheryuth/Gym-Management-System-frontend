import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

export default function MembershipFormModal({
  isOpen,
  onClose,
  onSubmit,
  members = [],
  plans = [],
  isLoading = false,
  initialMemberID = ''
}) {
  const [memberID, setMemberID] = useState('');
  const [planID, setPlanID] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('KHQR');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const defaultId = initialMemberID || members[0]?.memberID || members[0]?.id || '';
      setMemberID(String(defaultId));
      setPlanID(plans[0]?.planID || '');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDiscount('0');
      setPaymentMethod('KHQR');
      setErrors({});
    }
  }, [isOpen, members, plans, initialMemberID]);

  const validateForm = () => {
    const newErrors = {};

    if (!memberID) {
      newErrors.memberID = 'Please select a member';
    }

    if (!planID) {
      newErrors.planID = 'Please select a gym plan';
    }

    if (!startDate) {
      newErrors.startDate = 'Please specify a start date';
    }

    const discountNum = Number(discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      newErrors.discount = 'Discount must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedMemberObj = members.find(
      m => String(m.memberID) === String(memberID) || String(m.id) === String(memberID)
    );
    
    onSubmit({
      memberID,
      memberName: selectedMemberObj ? selectedMemberObj.fullName : 'N/A',
      planID,
      startDate,
      discount: Number(discount),
      paymentMethod
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create Membership Subscription"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Select Member Dropdown */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Select Member
          </label>
          <select
            className="form-input"
            value={memberID}
            onChange={(e) => setMemberID(e.target.value)}
            disabled={isLoading}
            style={{ padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)' }}
          >
            {members.length === 0 ? (
              <option value="">No eligible members available</option>
            ) : (
              members.map((m) => (
                <option key={m.memberID} value={m.memberID}>
                  {m.fullName} ({m.phoneNumber})
                </option>
              ))
            )}
          </select>
          {errors.memberID && <span className="form-error-msg">{errors.memberID}</span>}
        </div>

        {/* Select Plan Dropdown */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Select Gym Plan
          </label>
          <select
            className="form-input"
            value={planID}
            onChange={(e) => setPlanID(e.target.value)}
            disabled={isLoading}
            style={{ padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)' }}
          >
            {plans.length === 0 ? (
              <option value="">No plans defined</option>
            ) : (
              plans.map((p) => (
                <option key={p.planID} value={p.planID}>
                  {p.planName} - ${Number(p.planPrice).toFixed(2)}
                </option>
              ))
            )}
          </select>
          {errors.planID && <span className="form-error-msg">{errors.planID}</span>}
        </div>

        {/* Start Date */}
        <InputField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={errors.startDate}
          disabled={isLoading}
        />

        {/* Discount */}
        <InputField
          label="Discount Percentage (%)"
          type="number"
          placeholder="0"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          error={errors.discount}
          disabled={isLoading}
        />

        {/* Payment Method Select */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Payment Method
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['KHQR', 'CASH', 'CREDIT_CARD'].map((method) => (
              <button
                key={method}
                type="button"
                className={`enum-pill-btn ${paymentMethod === method ? 'active' : ''}`}
                onClick={() => !isLoading && setPaymentMethod(method)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  background: paymentMethod === method ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: paymentMethod === method ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {method === 'CREDIT_CARD' ? 'Credit Card' : method}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            style={{ flex: 1 }}
          >
            Process & Pay
          </Button>
        </div>

      </form>
    </Modal>
  );
}
