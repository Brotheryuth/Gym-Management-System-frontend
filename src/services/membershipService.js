export async function createMembershipApi(subscriptionData, isSimulated) {
  const subPayload = {
    memberID: subscriptionData.memberID,
    planID: subscriptionData.planID,
    startDate: subscriptionData.startDate,
    discount: Number(subscriptionData.discount),
    paymentMethod: subscriptionData.paymentMethod,
  };

  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 800));
    const mockSubID = String(Math.floor(Math.random() * 1000) + 50);
    return {
      memberID: subscriptionData.memberID,
      memberName: subscriptionData.memberName,
      membershipID: mockSubID,
      paymentID: `pay-${mockSubID}`,
      planID: subscriptionData.planID,
      discount: subPayload.discount,
      paymentMethod: subPayload.paymentMethod,
    };
  }

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
