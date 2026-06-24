import React from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

export default function MemberForm({ 
  formData, 
  errors, 
  onChange, 
  onRegister, 
  registeredMember, 
  isLoading,
  isEditing
}) {
  return (
    <Card>
      <h3 className="form-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-orange)' }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        1. Member Profile Details
      </h3>

      {registeredMember && (
        <div style={{ 
          backgroundColor: 'var(--color-success-bg)', 
          color: 'var(--color-success)', 
          border: '1.5px solid rgba(16, 185, 129, 0.2)', 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-sm)', 
          fontSize: '14px', 
          fontWeight: 600, 
          marginBottom: '20px' 
        }}>
          Member profile created successfully. ID: {registeredMember.memberID}
        </div>
      )}
      
      <div className="form-grid-2">
        <InputField
          label="Full Name"
          placeholder="e.g. Alice Smith"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
          disabled={!!registeredMember}
        />
        
        <InputField
          label="Phone Number"
          placeholder="e.g. 0987654321"
          value={formData.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          disabled={!!registeredMember}
          rightLabel="Validates in real-time"
        />
      </div>

      <div className="form-grid-2">
        <InputField
          label="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={(e) => onChange('dob', e.target.value)}
          error={errors.dob}
          disabled={!!registeredMember}
        />
        
        <div className="form-group">
          <label className="form-label">Gender Identity</label>
          <div className="enum-pill-group">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`enum-pill-btn ${formData.gender === opt.value ? 'active' : ''}`}
                onClick={() => !registeredMember && onChange('gender', opt.value)}
                disabled={!!registeredMember}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.gender && <span className="form-error-msg">{errors.gender}</span>}
        </div>
      </div>

      {!registeredMember && (
        <Button
          type="button"
          onClick={onRegister}
          loading={isLoading}
          style={{ marginTop: '12px' }}
        >
          {isEditing ? 'Update Member Profile' : 'Register Member Profile'}
        </Button>
      )}
    </Card>
  );
}
