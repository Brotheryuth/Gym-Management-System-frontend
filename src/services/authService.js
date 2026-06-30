export async function loginApi(username, password) {
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
