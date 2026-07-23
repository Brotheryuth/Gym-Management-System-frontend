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
  isEditing,
  onViewProfile
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 4px' }}>
      {/* Top CTA Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '4px' }}>
        <Button 
          variant="secondary"
          onClick={handleResetFlow}
          style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px', color: 'var(--text-primary)', border: '1.5px solid var(--color-border)', backgroundColor: 'var(--bg-surface)' }}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Aligned 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="workspace-left">
          {activeReceipt ? (
            <ReceiptCard
              receiptData={activeReceipt}
              planDetails={plans.find(p => String(p.planID) === String(activeReceipt.planID))}
              onReset={handleResetFlow}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

        {/* Sidebar list logs preview - Aligned pixel-perfectly */}
        <div className="workspace-right">
          <RecentMembersList
            members={recentMembers}
            isLoading={isLoading && recentMembers.length === 0}
            onViewProfile={onViewProfile}
          />
        </div>
      </div>
    </div>
  );
}
