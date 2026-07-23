// Utility helper to format human-readable error messages for cashiers

export function formatErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const raw = typeof error === 'string' ? error : error.message || String(error);
  const msg = raw.toLowerCase();

  // Duplicate Phone Number
  if (msg.includes('phone') && (msg.includes('exist') || msg.includes('duplicate') || msg.includes('already') || msg.includes('registered') || msg.includes('unique'))) {
    return 'This phone number is already registered to an existing member profile.';
  }

  // Member already has active subscription
  if ((msg.includes('active') || msg.includes('already') || msg.includes('exist')) && (msg.includes('membership') || msg.includes('plan') || msg.includes('subscri'))) {
    return 'This member already has an active subscription. Cancel or wait for expiration before creating a new plan.';
  }

  // Payment Declined / Terminal Error
  if (msg.includes('payment') || msg.includes('card') || msg.includes('decline') || msg.includes('terminal')) {
    return 'Payment authorization failed. Please verify payment method or switch to KHQR / Cash.';
  }

  // Login Failure
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('login failed')) {
    return 'Invalid username or password. Please verify your credentials.';
  }

  // Admin Permission
  if (msg.includes('403') || msg.includes('admin') || msg.includes('permission')) {
    return 'Administrator privileges required to perform this action.';
  }

  // Not Found
  if (msg.includes('404') || msg.includes('not found')) {
    return 'The requested resource could not be found.';
  }

  // Clean up generic prefixes
  let clean = raw.replace(/^(server error:\s*|failed to\s*)/i, '');
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    return clean;
  }

  return raw;
}
