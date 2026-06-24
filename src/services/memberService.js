export async function registerMemberApi(memberData, isSimulated) {
  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 800));
    const mockID = String(Math.floor(Math.random() * 1000) + 12);
    return {
      memberID: mockID,
      fullName: memberData.fullName,
      phoneNumber: memberData.phoneNumber,
      dob: memberData.dob,
      gender: memberData.gender,
    };
  }
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

export async function updateMemberApi(memberID, memberData, isSimulated) {
  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 600));
    return { memberID, ...memberData };
  }
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

export async function deleteMemberApi(memberID, isSimulated) {
  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  const res = await fetch(`/api/members/${memberID}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete member profile');
}
