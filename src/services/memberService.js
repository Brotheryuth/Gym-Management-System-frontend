export async function registerMemberApi(memberData) {
  const res = await fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) {
    throw new Error('Failed to register member profile');
  }
  const data = await res.json();
  return {
    memberID: String(data.memberID || data.id),
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    dob: data.dob,
    gender: data.gender,
  };
}

export async function updateMemberApi(memberID, memberData) {
  const res = await fetch(`/api/members/${memberID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) throw new Error('Failed to update member profile');
  const data = await res.json();
  return {
    memberID: String(data.memberID || data.id),
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    dob: data.dob,
    gender: data.gender,
  };
}

export async function deleteMemberApi(memberID) {
  const res = await fetch(`/api/members/${memberID}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete member profile');
}

export async function fetchMembersApi() {
  const res = await fetch('/api/members');
  if (!res.ok) throw new Error('Failed to fetch members list');
  return await res.json();
}
