import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

export default function MemberFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('MALE');
  
  const [errors, setErrors] = useState({});

  // Pre-populate fields on edit mode or reset on create mode
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFullName(initialData.fullName || '');
        setPhoneNumber(initialData.phoneNumber || '');
        setDob(initialData.dob || '');
        setGender(initialData.gender || 'MALE');
      } else {
        setFullName('');
        setPhoneNumber('');
        setDob('');
        setGender('MALE');
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Real-time or submit-time validation helper
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters long';
    }

    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const phoneRegex = /^\d{9,11}$/;
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phoneNumber = 'Enter a valid phone number (9 to 11 digits)';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(dob);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      dob,
      gender,
      memberStatus: initialData?.memberStatus || initialData?.status || 'ACTIVE'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Update Member Profile' : 'Register Member Profile'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <InputField
          label="Full Name"
          placeholder="e.g. Alice Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          disabled={isLoading}
        />

        <InputField
          label="Phone Number"
          placeholder="e.g. 0987654321"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={errors.phoneNumber}
          disabled={isLoading}
        />

        <InputField
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          error={errors.dob}
          disabled={isLoading}
        />

        <div className="form-group">
          <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Gender Identity
          </label>
          <div className="enum-pill-group" style={{ display: 'flex', gap: '10px' }}>
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`enum-pill-btn ${gender === opt.value ? 'active' : ''}`}
                onClick={() => !isLoading && setGender(opt.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  background: gender === opt.value ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: gender === opt.value ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

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
            {initialData ? 'Save Changes' : 'Register Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
