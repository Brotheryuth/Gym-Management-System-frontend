export async function loginApi(username, password, isSimulated) {
  if (isSimulated) {
    await new Promise((r) => setTimeout(r, 600));
    if (username === 'admin' && password === 'admin123') {
      return { id: '1', name: 'admin', role: 'ADMIN', shift: 'FULLTIME' };
    } else {
      throw new Error('Invalid credentials. Hint: use admin/admin123');
    }
  }
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: username, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed');
  }
  return await res.json();
}
