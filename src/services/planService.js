export async function fetchPlansApi(isSimulated, mockPlans = []) {
  if (isSimulated) return mockPlans;
  const res = await fetch('/api/plans');
  if (!res.ok) throw new Error('Failed to fetch plans');
  return await res.json();
}
