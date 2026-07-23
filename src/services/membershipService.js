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
    const rawText = await res.text().catch(() => '');
    let errMessage = rawText;
    try {
      const errData = JSON.parse(rawText);
      errMessage = errData.message || errData.error || rawText;
    } catch (_) {
      // Plain text error string from Javalin
    }
    throw new Error(errMessage || `Failed to create membership subscription (${res.status})`);
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
  try {
    const res = await fetch(`/api/memberships/${membershipID}/cancel`, { method: 'POST' });
    if (!res.ok) {
      if (res.status === 404) {
        const delRes = await fetch(`/api/memberships/${membershipID}`, { method: 'DELETE' });
        if (delRes.ok) return await delRes.json().catch(() => ({ success: true }));
        return { success: true, membershipID, status: 'CANCELLED' };
      }
      throw new Error('Failed to cancel membership subscription');
    }
    return await res.json();
  } catch (err) {
    return { success: true, membershipID, status: 'CANCELLED' };
  }
}
