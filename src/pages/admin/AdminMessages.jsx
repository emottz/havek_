import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './Admin.css'

const AdminMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id) => {
    await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id)
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: true } : m))
  }

  const handleOpen = (msg) => {
    setSelected(msg)
    if (!msg.is_read) markRead(msg.id)
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  const formatDate = (str) => new Date(str).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>
            Gelen Mesajlar
            {unreadCount > 0 && (
              <span className="admin-unread-badge">{unreadCount} yeni</span>
            )}
          </h1>
        </div>
      </div>

      {loading ? (
        <p style={{ padding: '2rem', color: '#64748b' }}>Yükleniyor...</p>
      ) : messages.length === 0 ? (
        <p style={{ padding: '2rem', color: '#64748b' }}>Henüz mesaj yok.</p>
      ) : (
        <div className="admin-messages-layout">
          {/* Liste */}
          <div className="admin-messages-list">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`admin-message-item ${!msg.is_read ? 'unread' : ''} ${selected?.id === msg.id ? 'active' : ''}`}
                onClick={() => handleOpen(msg)}
              >
                <div className="admin-message-item__top">
                  <span className="admin-message-item__name">{msg.name}</span>
                  <span className="admin-message-item__date">{formatDate(msg.created_at)}</span>
                </div>
                <div className="admin-message-item__company">{msg.company || msg.email}</div>
                <div className="admin-message-item__preview">
                  {msg.product ? `[${msg.product}] ` : ''}{msg.message?.slice(0, 80)}...
                </div>
              </div>
            ))}
          </div>

          {/* Detay */}
          <div className="admin-message-detail">
            {selected ? (
              <>
                <div className="admin-message-detail__header">
                  <h2>{selected.name}</h2>
                  <span className="admin-message-detail__date">{formatDate(selected.created_at)}</span>
                </div>
                <div className="admin-message-detail__fields">
                  {selected.company && (
                    <div className="admin-message-field">
                      <span className="admin-message-field__label">Kurum</span>
                      <span>{selected.company}</span>
                    </div>
                  )}
                  <div className="admin-message-field">
                    <span className="admin-message-field__label">E-posta</span>
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div className="admin-message-field">
                      <span className="admin-message-field__label">Telefon</span>
                      <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </div>
                  )}
                  {selected.product && (
                    <div className="admin-message-field">
                      <span className="admin-message-field__label">Ürün / Konu</span>
                      <span>{selected.product}</span>
                    </div>
                  )}
                </div>
                <div className="admin-message-detail__body">
                  <span className="admin-message-field__label">Mesaj</span>
                  <p>{selected.message}</p>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.product || 'HAVEK'}`} className="admin-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
                  ✉️ Yanıtla
                </a>
              </>
            ) : (
              <div className="admin-message-empty">
                <p>Detayları görmek için bir mesaj seçin.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMessages
