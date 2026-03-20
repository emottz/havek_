import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './Admin.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/urunler', { replace: true })
    })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      navigate('/admin/urunler')
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/newlogo01.png" alt="HAVEK" />
        </div>
        <h1 className="admin-login-title">Admin Girişi</h1>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@havek.tr"
              required
            />
          </div>
          <div className="admin-field">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
