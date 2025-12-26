const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type SignupData = { name: string; email: string; password: string }
type LoginData = { email: string; password: string }

export async function signup(data: SignupData) {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Signup failed')
  localStorage.setItem('token', json.token)
  localStorage.setItem('user', JSON.stringify(json.user))
  return json
}

export async function login(data: LoginData) {
  console.log('AuthService login called with:', { email: data.email, password: '***' })
  console.log('API URL:', `${API}/api/auth/login`)
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  console.log('Login response status:', res.status)
  const json = await res.json()
  console.log('Login response data:', json)
  if (!res.ok) throw new Error(json.error || 'Login failed')
  localStorage.setItem('token', json.token)
  localStorage.setItem('user', JSON.stringify(json.user))
  return json
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getUser() {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export default { signup, login, logout, getUser }

