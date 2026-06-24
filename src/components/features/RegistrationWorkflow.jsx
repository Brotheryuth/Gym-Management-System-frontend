import React from 'react';
import Button from '../ui/Button';
import ReceiptCard from './ReceiptCard';
import MemberForm from './MemberForm';
import PlanSelection from './PlanSelection';
import RecentMembersList from './RecentMembersList';

/**
 * RegistrationWorkflow component.
 * @param {object} props
 * @param {object} props.form - Form fields state
 * @param {object} props.errors - Validation errors
 * @param {function} props.handleFormChange - Single field form update handler
 * @param {function} props.handleRegisterMember - Step 1 submission callback
 * @param {object} props.registeredMember - Step 1 returned registered member state
 * @param {boolean} props.isFormLoading - Step 1 network loading state
 * @param {Array} props.plans - List of available gym plans
 * @param {function} props.handleCreateMembership - Step 2 submission callback
 * @param {boolean} props.isLoading - Step 2 API request loading state
 * @param {number} props.finalPrice - Total membership cost computed
 * @param {object} props.activeReceipt - Successful billing receipt details to show
 * @param {function} props.handleResetFlow - Reset workflow state callback
 * @param {Array} props.recentMembers - Cashier's recent registrations log
 * @param {string} props.apiError - Global server API warnings
 */
export default function RegistrationWorkflow({
  form,
  errors,
  handleFormChange,
  handleRegisterMember,
  registeredMember,
  isFormLoading,
  plans = [],
  handleCreateMembership,
  isLoading,
  finalPrice,
  activeReceipt,
  handleResetFlow,
  recentMembers = [],
  apiError,
  isEditing
}) {
  return (
    <div className="dashboard-grid">
      <div className="workspace-left">
        {/* Back CTA Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
          <Button 
            variant="outline"
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
              isEditing={isEditing}
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
  );
}
