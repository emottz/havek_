import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './Admin.css'

const CATEGORY_LABELS = {
  'atolye': 'Atölye',
  'ata-chapter': 'ATA Chapter',
  'simulator': 'Simülatör',
}
const CATEGORY_CSS = {
  'atolye': 'atolye',
  'ata-chapter': 'ata-chapter',
  'simulator': 'simulator',
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, title, categories, display_order, is_active, images')
      .order('display_order', { ascending: true })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const handleToggleActive = async (id, current) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    fetchProducts()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <Link to="/" className="admin-back-site">← Siteye Dön</Link>
          <h1>Ürün Yönetimi</h1>
        </div>
        <div className="admin-header-right">
          <Link to="/admin/urun/yeni" className="admin-btn-primary">+ Yeni Ürün Ekle</Link>
          <Link to="/admin/mesajlar" className="admin-btn-outline">✉️ Mesajlar</Link>
          <Link to="/admin/ayarlar" className="admin-btn-outline">Site Ayarları</Link>
          <button onClick={handleLogout} className="admin-btn-outline">Çıkış</button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Başlık</th>
                <th>Kategori</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className={!p.is_active ? 'row-passive' : ''}>
                  <td>
                    {p.images && p.images.length > 0
                      ? <img src={p.images[0]} alt={p.title} className="admin-thumb" />
                      : <div className="admin-thumb-empty">—</div>
                    }
                  </td>
                  <td className="admin-td-title">
                    <span className="admin-product-title">{p.title}</span>
                    <span className="admin-product-id">{p.id}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(p.categories && p.categories.length > 0)
                        ? p.categories.map(cat => (
                            <span key={cat} className={`admin-badge admin-badge--${CATEGORY_CSS[cat] || 'genel'}`}>
                              {CATEGORY_LABELS[cat] || cat}
                            </span>
                          ))
                        : <span className="admin-badge admin-badge--genel">Genel</span>
                      }
                    </div>
                  </td>
                  <td>{p.display_order}</td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(p.id, p.is_active)}
                      className={`admin-toggle ${p.is_active ? 'active' : 'passive'}`}
                    >
                      {p.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="admin-td-actions">
                    <Link to={`/admin/urun/${p.id}/duzenle`} className="admin-btn-edit">Düzenle</Link>
                    <button onClick={() => handleDelete(p.id, p.title)} className="admin-btn-delete">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
