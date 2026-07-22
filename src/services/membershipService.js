export async function createMembershipApi(subscriptionData) {
  const memId = Number(subscriptionData.memberID) || Number(subscriptionData.id) || subscriptionData.memberID;
  const pId = Number(subscriptionData.planID) || subscriptionData.planID;

  const subPayload = {
    memberID: memId,
    planID: pId,
    startDate: subscriptionData.startDate || new Date().toISOString().split('T')[0],
    discount: Number(subscriptionData.discount) || 0,
    paymentMethod: subscriptionData.paymentMethod || 'KHQR',
  };

  const res = await fetch('/api/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subPayload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.error || `Failed to create membership subscription (${res.status})`);
  }
  const data = await res.json();
  const subID = String(data.membershipID || data.id);
  const payID = String(data.paymentID || data.payment?.id || `pay-${subID}`);

  return {
    memberID: subscriptionData.memberID,
    memberName: subscriptionData.memberName,
    membershipID: subID,
    paymentID: payID,
    planID: subscriptionData.planID,
    discount: subPayload.discount,
    paymentMethod: subPayload.paymentMethod,
  };
}

export async function cancelMembershipApi(membershipID) {
  const res = await fetch(`/api/memberships/${membershipID}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to cancel membership subscription');
  return await res.json();
}
