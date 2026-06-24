export async function confirmPaymentApi(paymentID, paymentMethod, isSimulated) {
  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true, paymentID };
  }
  const res = await fetch(`/api/payments/${paymentID}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod }),
  });
  if (!res.ok) {
    throw new Error('Payment processing failed. Card declined or terminal error.');
  }
  return { success: true, paymentID };
}
