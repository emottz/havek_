import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { SOCIAL_PLATFORMS, getPlatform } from '../../lib/socialPlatforms'
import './Admin.css'
import './AdminSettings.css'

const AdminSettings = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', email: '', address: '', map_query: '', form_email: '', web3forms_key: '' })
  const [socials, setSocials] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // New social form
  const [newSocial, setNewSocial] = useState({ platform: 'instagram', label: '', url: '' })
  const [showSocialForm, setShowSocialForm] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) {
        setForm({ phone: data.phone || '', email: data.email || '', address: data.address || '', map_query: data.map_query || '', form_email: data.form_email || '', web3forms_key: data.web3forms_key || '' })
        setSocials(data.socials || [])
      }
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { error: err } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...form, socials, updated_at: new Date().toISOString() })

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  // Social helpers
  const addSocial = () => {
    if (!newSocial.url) return
    const platform = getPlatform(newSocial.platform)
    setSocials(s => [...s, {
      id: Date.now().toString(),
      platform: newSocial.platform,
      label: newSocial.label || platform.label,
      url: newSocial.url,
    }])
    setNewSocial({ platform: 'instagram', label: '', url: '' })
    setShowSocialForm(false)
  }

  const removeSocial = (id) => setSocials(s => s.filter(x => x.id !== id))

  const moveSocial = (idx, dir) => {
    setSocials(s => {
      const arr = [...s]
      const t = idx + dir
      if (t < 0 || t >= arr.length) return s;
      [arr[idx], arr[t]] = [arr[t], arr[idx]]
      return arr
    })
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <Link to="/admin/urunler" className="admin-back-site">← Ürün Listesine Dön</Link>
          <h1>Site Ayarları</h1>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className="admin-btn-outline">Çıkış</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-form settings-form">

        {/* İletişim Bilgileri */}
        <div className="settings-section">
          <h2 className="settings-section__title">İletişim Bilgileri</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Telefon</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+90 5XX XXX XX XX" />
            </div>
            <div className="admin-field">
              <label>E-posta</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="sales@havek.tr" />
            </div>
            <div className="admin-field admin-field--full">
              <label>Adres</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Sokak, No, İlçe / İl" />
            </div>
            <div className="admin-field admin-field--full">
              <label>
                Web3Forms API Key
                <small style={{ fontWeight: 400, color: '#64748b' }}> — <a href="https://web3forms.com" target="_blank" rel="noreferrer" style={{ color: '#2e6da4' }}>web3forms.com</a>'dan ücretsiz al (emailinizi girin, key gelir)</small>
              </label>
              <input value={form.web3forms_key} onChange={e => setForm(f => ({ ...f, web3forms_key: e.target.value }))} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            </div>
            <div className="admin-field admin-field--full">
              <label>Google Maps Sorgusu <small style={{ fontWeight: 400, color: '#64748b' }}>(haritada aranacak metin)</small></label>
              <input value={form.map_query} onChange={e => setForm(f => ({ ...f, map_query: e.target.value }))} placeholder="Üsküp Cd No:138 Bağcılar İstanbul" />
              {form.map_query && (
                <small>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(form.map_query)}`} target="_blank" rel="noreferrer" style={{ color: '#2e6da4' }}>
                    Haritada görüntüle ↗
                  </a>
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="settings-section">
          <div className="settings-section__head">
            <h2 className="settings-section__title">Sosyal Medya</h2>
            {!showSocialForm && (
              <button type="button" className="admin-btn-primary" onClick={() => setShowSocialForm(true)}>
                + Hesap Ekle
              </button>
            )}
          </div>

          {/* Yeni sosyal hesap formu */}
          {showSocialForm && (
            <div className="social-add-form">
              <div className="social-platform-picker">
                {SOCIAL_PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`platform-btn ${newSocial.platform === p.id ? 'selected' : ''}`}
                    style={{ '--platform-color': p.color }}
                    onClick={() => setNewSocial(s => ({ ...s, platform: p.id, label: '' }))}
                    dangerouslySetInnerHTML={{ __html: `<span class="platform-btn__icon">${p.icon}</span><span class="platform-btn__label">${p.label}</span>` }}
                  />
                ))}
              </div>
              <div className="social-add-inputs">
                <div className="admin-field">
                  <label>Kullanıcı Adı / Etiket</label>
                  <input
                    value={newSocial.label}
                    onChange={e => setNewSocial(s => ({ ...s, label: e.target.value }))}
                    placeholder={`@kullanıcıadı`}
                  />
                </div>
                <div className="admin-field">
                  <label>URL *</label>
                  <input
                    value={newSocial.url}
                    onChange={e => setNewSocial(s => ({ ...s, url: e.target.value }))}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
              <div className="social-add-actions">
                <button type="button" className="admin-btn-primary" onClick={addSocial} disabled={!newSocial.url}>Ekle</button>
                <button type="button" className="admin-btn-outline" style={{ color: '#64748b', borderColor: '#cbd5e1', background: 'transparent' }} onClick={() => setShowSocialForm(false)}>İptal</button>
              </div>
            </div>
          )}

          {/* Mevcut hesaplar */}
          {socials.length > 0 ? (
            <div className="socials-list">
              {socials.map((s, idx) => {
                const platform = getPlatform(s.platform)
                return (
                  <div key={s.id} className="social-item">
                    <div
                      className="social-item__icon"
                      style={{ color: platform.color }}
                      dangerouslySetInnerHTML={{ __html: platform.icon }}
                    />
                    <div className="social-item__info">
                      <span className="social-item__platform">{platform.label}</span>
                      <span className="social-item__label">{s.label || s.url}</span>
                      <a href={s.url} target="_blank" rel="noreferrer" className="social-item__url">{s.url}</a>
                    </div>
                    <div className="social-item__actions">
                      <button type="button" onClick={() => moveSocial(idx, -1)} disabled={idx === 0} title="Yukarı">↑</button>
                      <button type="button" onClick={() => moveSocial(idx, 1)} disabled={idx === socials.length - 1} title="Aşağı">↓</button>
                      <button type="button" onClick={() => removeSocial(s.id)} className="social-item__delete" title="Kaldır">✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="socials-empty">Henüz sosyal medya hesabı eklenmemiş.</p>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}
        {saved && <p style={{ color: '#15803d', fontWeight: 600, fontSize: '0.875rem' }}>✓ Kaydedildi.</p>}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
