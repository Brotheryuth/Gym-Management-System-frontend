// Consolidated API Service Layer (Clean Code & DRY Principle)

async function request(url, options = {}, defaultError = 'API Request Failed') {
  const config = {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers,
  };
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errText = errData.message || errData.error || (await res.text().catch(() => ''));
    throw new Error(errText || `${defaultError} (${res.status})`);
  }
  if (res.status === 204) return null;
  return await res.json().catch(() => null);
}

// ── Auth ──
export const loginApi = (username, password) =>
  request('/api/auth/login', { method: 'POST', body: { identifier: username, password } }, 'Login failed');

// ── Members ──
export const fetchMembersApi = () => request('/api/members');

export const registerMemberApi = async (memberData) => {
  const data = await request('/api/members', { method: 'POST', body: memberData }, 'Failed to register member profile');
  return { ...data, memberID: String(data.memberID || data.id) };
};

export const updateMemberApi = async (memberID, memberData) => {
  const data = await request(`/api/members/${memberID}`, { method: 'PUT', body: memberData }, 'Failed to update member profile');
  return { ...data, memberID: String(data.memberID || data.id) };
};

export const deleteMemberApi = (memberID) =>
  request(`/api/members/${memberID}`, { method: 'DELETE' }, 'Failed to delete member profile');

// ── Gym Plans ──
export const fetchPlansApi = () => request('/api/plans');
export const createPlanApi = (data) => request('/api/plans', { method: 'POST', body: data }, 'Failed to create gym plan');
export const updatePlanApi = (id, data) => request(`/api/plans/${id}`, { method: 'PUT', body: data }, 'Failed to update gym plan');
export const deletePlanApi = (id) => request(`/api/plans/${id}`, { method: 'DELETE' }, 'Failed to delete gym plan');

// ── Memberships ──
export const createMembershipApi = async (subData) => {
  const payload = {
    memberID: Number(subData.memberID) || Number(subData.id) || subData.memberID,
    planID: Number(subData.planID) || subData.planID,
    startDate: subData.startDate || new Date().toISOString().split('T')[0],
    discount: Number(subData.discount) || 0,
    paymentMethod: subData.paymentMethod || 'KHQR'
  };
  const data = await request('/api/memberships', { method: 'POST', body: payload }, 'Failed to create membership subscription');
  const subID = String(data.membershipID || data.id);
  return {
    ...subData,
    membershipID: subID,
    paymentID: String(data.paymentID || data.payment?.id || `pay-${subID}`)
  };
};

export const cancelMembershipApi = (id) =>
  request(`/api/memberships/${id}/cancel`, { method: 'POST' }, 'Failed to cancel membership subscription');

// ── Payments ──
export const confirmPaymentApi = async (id, paymentMethod) => {
  await request(`/api/payments/${id}/process`, { method: 'POST', body: { paymentMethod } }, 'Payment processing failed. Card declined or terminal error.');
  return { success: true, paymentID: id };
};

export const refundPaymentApi = (id) =>
  request(`/api/payments/${id}/refund`, { method: 'POST' }, 'Failed to refund payment transaction');
