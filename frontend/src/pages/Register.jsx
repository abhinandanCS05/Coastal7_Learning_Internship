import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">DAY 11</p>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>Email<input name="email" type="email" required value={form.email} onChange={handleChange} /></label>
        <label>Password<input name="password" type="password" minLength="6" required value={form.password} onChange={handleChange} /></label>
        {error && <p className="error">{error}</p>}
        <button disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <p className="muted">Already registered? <Link to="/login">Sign in</Link></p>
    </section>
  )
}
