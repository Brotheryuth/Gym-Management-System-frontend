import React, { useMemo } from 'react';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

export default function PlanSelection({
  plans = [],
  selectedPlanID,
  discount,
  paymentMethod,
  startDate,
  errors = {},
  onChange,
  registeredMember
}) {
  // Memoize plan calculations
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

  // Define payment options with SVG icons (Strictly zero emojis)
  const gateways = [
    {
      id: 'KHQR',
      title: 'KHQR Mobile Scan',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: 'BYCASH',
      title: 'Physical Cash',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <circle cx="12" cy="12" r="2"></circle>
          <line x1="6" y1="12" x2="6.01" y2="12"></line>
          <line x1="18" y1="12" x2="18.01" y2="12"></line>
        </svg>
      )
    },
    {
      id: 'CREDITCARD',
      title: 'POS Card Tap',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gateway-card-icon">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    }
  ];

  return (
    <div>
      {!registeredMember && (
        <div className="locked-overlay-notice">
          Complete Step 1 (Register Member) to unlock Plan & Billing Specifications.
        </div>
      )}

      <div className={!registeredMember ? 'locked-section' : ''}>
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
              disabled={!registeredMember}
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
              disabled={!registeredMember}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <InputField
              label="Activation Start Date"
              type="date"
              value={startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              error={errors.startDate}
              disabled={!registeredMember}
            />
          </div>

          {/* Styled Enum Selector for Gateway */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Payment Gateway</label>
            <div className="gateway-grid">
              {gateways.map((g) => (
                <div
                  key={g.id}
                  className={`gateway-card ${paymentMethod === g.id ? 'active' : ''}`}
                  onClick={() => registeredMember && onChange('paymentMethod', g.id)}
                >
                  {g.icon}
                  <span className="gateway-card-title">{g.title}</span>
                </div>
              ))}
            </div>
            {errors.paymentMethod && <span className="form-error-msg">{errors.paymentMethod}</span>}
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
      </div>
    </div>
  );
}
