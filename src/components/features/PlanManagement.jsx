import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { formatErrorMessage } from '../../utils/errorFormatter';
import Card from '../ui/Card';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';

export default function PlanManagement({
  plans = [],
  recentMembers = [],
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  cashier,
  onShowAdminWarning
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form fields
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [formError, setFormError] = useState('');

  // 1. Calculations for stats box
  const totalPlans = plans.length;
  const avgPrice = totalPlans > 0 
    ? plans.reduce((sum, p) => sum + Number(p.planPrice), 0) / totalPlans 
    : 0;

  // Find most popular plan
  const planCounts = {};
  recentMembers.forEach(m => {
    if (m.planName) {
      planCounts[m.planName] = (planCounts[m.planName] || 0) + 1;
    }
  });
  let popularPlanName = 'N/A';
  let maxCount = 0;
  Object.keys(planCounts).forEach(name => {
    if (planCounts[name] > maxCount) {
      maxCount = planCounts[name];
      popularPlanName = name;
    }
  });

  const handleOpenForm = (plan = null) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    
    if (plan) {
      setEditingPlan(plan);
      setPlanName(plan.planName);
      setPlanPrice(String(plan.planPrice));
      setDuration(String(plan.duration));
    } else {
      setEditingPlan(null);
      setPlanName('');
      setPlanPrice('');
      setDuration('');
    }
    setIsFormOpen(true);
  };

  const handleDelete = (planID) => {
    if (cashier?.role !== 'ADMIN') {
      onShowAdminWarning();
      return;
    }
    if (window.confirm('Are you sure you want to delete this plan?')) {
      onDeletePlan(planID)
        .then(() => toast.success('Gym plan deleted successfully.'))
        .catch(err => {
          toast.error(formatErrorMessage(err));
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!planName.trim() || !planPrice || !duration) {
      toast.error('Please fill in all plan parameters.');
      return;
    }

    const priceNum = Number(planPrice);
    const durationNum = Number(duration);

    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Price must be a valid positive number.');
      return;
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error('Duration must be a positive integer number of days.');
      return;
    }

    try {
      setIsSaving(true);
      const planPayload = {
        planName: planName.trim(),
        planPrice: priceNum,
        duration: Math.round(durationNum)
      };

      if (editingPlan) {
        await onUpdatePlan(editingPlan.planID, planPayload);
        toast.success(`Plan "${planPayload.planName}" updated.`);
      } else {
        await onCreatePlan(planPayload);
        toast.success(`Plan "${planPayload.planName}" created.`);
      }
      setIsFormOpen(false);
    } catch (err) {
      setFormError(err.message || 'Error occurred while saving plan.');
    }
  };

  return (
    <div className="dashboard-overview-container">
      {/* 1. Stats overview banner */}
      <div className="purity-grid-2-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Active Gym Plans</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">{totalPlans}</span>
            </div>
          </div>
          <div className="purity-metric-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Average Price</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value">${avgPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="purity-metric-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        <div className="purity-card purity-metric-card">
          <div className="purity-metric-info">
            <h5>Popular Tier</h5>
            <div className="purity-metric-value-row">
              <span className="purity-metric-value" style={{ fontSize: '15px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'inline-block', maxWidth: '180px' }}>
                {popularPlanName}
              </span>
            </div>
          </div>
          <div className="purity-metric-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Headline with CTAs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="form-section-title" style={{ margin: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--accent-blue)' }}>
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
          </svg>
          Gym Membership Tiers
        </h3>
        <Button
          onClick={() => handleOpenForm(null)}
          style={{ width: 'auto', minHeight: '38px', padding: '6px 16px', fontSize: '13px' }}
        >
          Add New Plan
        </Button>
      </div>

      {/* 3. Plans Cards Grid */}
      {(() => {
        const pageSize = 20;
        const paginatedPlans = plans.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {paginatedPlans.length === 0 ? (
                <Card style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No plans available.
                </Card>
              ) : (
                paginatedPlans.map(p => (
                  <Card key={p.planID} hoverLift style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Plan ID: #{p.planID}</span>
                      <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 12px' }}>{p.planName}</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-blue)' }}>${Number(p.planPrice).toFixed(2)}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ {p.duration} {p.duration === 1 ? 'Month' : 'Months'}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '12px' }}>
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenForm(p)}
                        style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', flex: 1 }}
                      >
                        Edit Plan
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(p.planID)}
                        style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px', flex: 1, color: 'var(--color-error)' }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={plans.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              itemLabel="plans"
            />
          </>
        );
      })()}

      {/* 4. Edit/Add Plan Dialog Modal */}
      <Modal
        isOpen={isFormOpen}
        title={editingPlan ? 'Modify Membership Tier' : 'Create New Gym Plan'}
        onClose={() => setIsFormOpen(false)}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {formError && (
            <div style={{
              backgroundColor: 'var(--color-error-bg)',
              border: '1.5px solid var(--color-error)',
              color: 'var(--color-error)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600
            }}>
              {formError}
            </div>
          )}

          <InputField
            label="Plan Name"
            placeholder="e.g. Bronze Starter Pack"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <InputField
              label="Tier Price ($USD)"
              type="number"
              placeholder="e.g. 49.99"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              step="0.01"
            />
            <InputField
              label="Duration (Months)"
              type="number"
              placeholder="e.g. 1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsFormOpen(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ flex: 1 }}
            >
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
