import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const { token, user } = res.data
      // Always store token for authentication
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="auth-page auth-login">
      <div className="auth-card">
        <h2>Welcome back 👋</h2>
        <p className="muted">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email or Username</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email or username" />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

          <div className="row between">
            <label className="checkbox"><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} /> Remember me</label>
            <Link to="/forgot" className="muted">Forgot Password?</Link>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="primary" type="submit">Login →</button>
        </form>

        <p className="muted">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  )
}
