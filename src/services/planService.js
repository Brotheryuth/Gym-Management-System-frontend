export async function fetchPlansApi() {
  const res = await fetch('/api/plans');
  if (!res.ok) throw new Error('Failed to fetch plans');
  return await res.json();
}

export async function createPlanApi(planData) {
  const res = await fetch('/api/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planData),
  });
  if (!res.ok) throw new Error('Failed to create gym plan');
  return await res.json();
}

export async function updatePlanApi(planID, planData) {
  const res = await fetch(`/api/plans/${planID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planData),
  });
  if (!res.ok) throw new Error('Failed to update gym plan');
  return await res.json();
}

export async function deletePlanApi(planID) {
  const res = await fetch(`/api/plans/${planID}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete gym plan');
}
