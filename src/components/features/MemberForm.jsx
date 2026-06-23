import React from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

export default function MemberForm({ formData, errors, onChange }) {
  return (
    <Card>
      <h3 className="form-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-orange)' }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        1. Member Profile Details
      </h3>
      
      <div className="form-grid-2">
        <InputField
          label="Full Name"
          placeholder="e.g. Alice Smith"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          error={errors.fullName}
        />
        
        <InputField
          label="Phone Number"
          placeholder="e.g. 0987654321"
          value={formData.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
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
        />
        
        <SelectField
          label="Gender Identity"
          options={GENDER_OPTIONS}
          value={formData.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          error={errors.gender}
          placeholder="Select gender"
        />
      </div>
    </Card>
  );
}
