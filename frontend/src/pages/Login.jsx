import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(location.state?.from || '/app', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">DAY 11</p>
      <h1>Sign in</h1>
      <p className="muted">JWT-authenticated React frontend</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
        <label>Password<input name="password" type="password" minLength="6" required value={form.password} onChange={handleChange} /></label>
        <label>Role<select name="role" value={form.role} onChange={handleChange}><option value="user">User</option><option value="admin">Admin</option></select></label>
        {error && <p className="error">{error}</p>}
        <button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="muted">New user? <Link to="/register">Create an account</Link></p>
    </section>
  )
}
