export async function createMembershipApi(subscriptionData) {
  const subPayload = {
    memberID: subscriptionData.memberID,
    planID: subscriptionData.planID,
    startDate: subscriptionData.startDate,
    discount: Number(subscriptionData.discount),
    paymentMethod: subscriptionData.paymentMethod,
  };

  const res = await fetch('/api/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subPayload),
  });
  if (!res.ok) {
    throw new Error('Failed to create membership subscription');
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
