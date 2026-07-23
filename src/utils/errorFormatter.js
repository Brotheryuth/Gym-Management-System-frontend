// Utility helper to format Java Backend exception messages for cashiers

export function formatErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const raw = typeof error === 'string' ? error : error.message || String(error);
  const msg = raw.toLowerCase().trim();

  if (msg.includes('phone') && (msg.includes('exist') || msg.includes('duplicate') || msg.includes('already'))) {
    return 'This phone number is already registered to an existing member profile.';
  }

  if (msg.includes('already has an active') || msg.includes('active or pending membership') || (msg.includes('subscription') && msg.includes('already'))) {
    return 'This member already has an active subscription. Cancel or wait for expiration before adding a new plan.';
  }

  if (msg.includes('member not found') || msg.includes('member is null')) {
    return 'Selected member profile was not found in the database.';
  }
  if (msg.includes('plan not found') || msg.includes('membership plan not found')) {
    return 'Selected gym plan was not found or has been removed.';
  }

  if (msg.includes('member id is required')) {
    return 'Please select a member before creating a subscription.';
  }
  if (msg.includes('plan id is required')) {
    return 'Please select a valid gym plan.';
  }

  // 5. Payment Authorization / Terminal Error
  // Backend string: "Failed to process payment."
  if (msg.includes('failed to process payment') || msg.includes('card declined')) {
    return 'Payment authorization failed. Please verify payment details or switch to KHQR / Cash.';
  }

  // 6. Already Inactive / Cancelled Membership
  // Backend string: "Membership is already inactive."
  if (msg.includes('already inactive') || msg.includes('already cancelled')) {
    return 'This membership subscription is already inactive or cancelled.';
  }

  // Clean generic "Server Error:" prefix if present
  let clean = raw.replace(/^(server error:\s*|failed to\s*|internal error:\s*)/i, '');
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return clean;
  }

  return raw;
}
