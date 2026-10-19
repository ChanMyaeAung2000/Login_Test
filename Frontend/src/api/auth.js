// Small helper around fetch so the forms stay clean.
// All requests go to /api/... — Vite proxies them to the backend (vite.config.js).

async function postJson(path, body) {
  let res
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Start the backend with: npm start (in the Backend folder)')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Something went wrong. Please try again.')
  }

  return data
}

export function loginUser({ email, password }) {
  return postJson('/api/login', { email, password })
}

export function registerUser({ name, email, password }) {
  return postJson('/api/register', { name, email, password })
}
