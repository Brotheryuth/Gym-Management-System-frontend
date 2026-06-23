import React, { useMemo } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const PAYMENT_METHODS = [
  { value: 'KHQR', label: 'KHQR (Mobile Scan)' },
  { value: 'BYCASH', label: 'BYCASH (Physical Cash)' },
  { value: 'CREDITCARD', label: 'CREDITCARD (POS Terminal)' }
];

export default function PlanSelection({
  plans = [],
  selectedPlanID,
  discount,
  paymentMethod,
  startDate,
  errors = {},
  onChange
}) {
  // Memoize active plan calculations
  const selectedPlan = useMemo(() => {
    return plans.find(p => String(p.planID) === String(selectedPlanID));
  }, [plans, selectedPlanID]);

  const basePrice = selectedPlan ? Number(selectedPlan.planPrice) : 0;
  const discountVal = Number(discount) || 0;
  const discountAmt = (basePrice * discountVal) / 100;
  const finalPrice = Math.max(0, basePrice - discountAmt);

  const planOptions = useMemo(() => {
    return plans.map(p => ({
      value: p.planID,
      label: `${p.planName} ($${p.planPrice.toFixed(2)} - ${p.duration} Days)`
    }));
  }, [plans]);

  return (
    <Card>
      <h3 className="form-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-orange)' }}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        2. Plan & Billing Specifications
      </h3>

      <div className="form-grid-2">
        <SelectField
          label="Gym Plan"
          options={planOptions}
          value={selectedPlanID}
          onChange={(e) => onChange('planID', e.target.value)}
          error={errors.planID}
          placeholder="Select membership tier"
        />

        <InputField
          label="Discount Percentage"
          type="number"
          min="0"
          max="100"
          placeholder="0"
          value={discount}
          onChange={(e) => onChange('discount', e.target.value)}
          error={errors.discount}
          rightLabel="Range: 0-100%"
        />
      </div>

      <div className="form-grid-2">
        <InputField
          label="Activation Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          error={errors.startDate}
        />

        <SelectField
          label="Payment Gateway"
          options={PAYMENT_METHODS}
          value={paymentMethod}
          onChange={(e) => onChange('paymentMethod', e.target.value)}
          error={errors.paymentMethod}
          placeholder="Select processing gateway"
        />
      </div>

      <div className="billing-breakdown">
        <div className="billing-row">
          <span>Membership Base Cost</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
        
        {discountVal > 0 && (
          <div className="billing-row discount-applied">
            <span>Discount Applied ({discountVal}%)</span>
            <span>-${discountAmt.toFixed(2)}</span>
          </div>
        )}

        <div className="billing-row total">
          <span>Total Amount Due</span>
          <span className="price-final">${finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
