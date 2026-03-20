import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useImageUpload } from '../../hooks/useImageUpload'
import { parseProductHTML } from '../../lib/parseProductHTML'
import { SECTION_TR_TO_EN } from '../../lib/pdfTranslations'
import './Admin.css'

async function translateText(text) {
  if (!text?.trim()) return '';
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=tr|en`
    );
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

const CATEGORIES = [
  { value: 'ata-chapter', label: 'ATA Chapter Bazlı' },
  { value: 'atolye',      label: 'Atölye Eğitim Seti' },
  { value: 'simulator',   label: 'Simülatör' },
]

const EMPTY = {
  id: '', title: '', description: '',
  title_en: '', description_en: '',
  images: [], folder: '', category: '',
  categories: [],
  display_order: 0, is_active: true,
}

const AdminProductForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [translating, setTranslating] = useState(false)
  const [formatting, setFormatting] = useState(false)
  const { upload, remove, uploading, uploadError, setUploadError } = useImageUpload()

  const handleFormatDescription = async () => {
    if (!form.description?.trim()) return
    setFormatting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await supabase.functions.invoke('format-description', {
        body: { text: form.description, title: form.title },
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      if (res.data?.formatted) {
        setForm(f => ({ ...f, description: res.data.formatted }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setFormatting(false)
    }
  }

  const handleAutoTranslate = async () => {
    if (!form.description && !form.title) return
    setTranslating(true)
    try {
      const titleEn = await translateText(form.title)

      const { intro, sections } = parseProductHTML(form.description)
      let descEn = ''

      if (intro) {
        const introEn = await translateText(intro)
        descEn += `<p>${introEn}</p>`
      }

      for (const sec of sections) {
        const secTitleEn = SECTION_TR_TO_EN[sec.title] || await translateText(sec.title)
        const itemsEn = []
        for (const item of sec.items) {
          itemsEn.push(await translateText(item))
        }
        descEn += `<h4>${secTitleEn}</h4><ul>${itemsEn.map(i => `<li>${i}</li>`).join('')}</ul>`
      }

      setForm(f => ({ ...f, title_en: titleEn, description_en: descEn }))
    } finally {
      setTranslating(false)
    }
  }

  useEffect(() => {
    if (!isEdit) return
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ ...data, images: data.images || [] })
    })
  }, [id, isEdit])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setCheck = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.checked }))

  const toggleCategory = (value) => {
    setForm(f => {
      const cats = f.categories || []
      const next = cats.includes(value)
        ? cats.filter(c => c !== value)
        : [...cats, value]
      return { ...f, categories: next }
    })
  }

  // Görsel yükleme: dosya seçilince çalışır
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadError('')

    for (const file of files) {
      const url = await upload(file)
      if (url) {
        setForm(f => ({ ...f, images: [...f.images, url] }))
      }
    }
    // Input'u sıfırla (aynı dosyayı tekrar seçmeye izin ver)
    e.target.value = ''
  }

  // Görseli listeden ve storage'dan kaldır
  const handleRemoveImage = async (idx) => {
    const url = form.images[idx]
    // Sadece Supabase Storage'daki görselleri storage'dan da sil
    if (url.includes('supabase.co/storage')) {
      await remove(url)
    }
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  // Sıra değiştir: sol/sağ ok
  const moveImage = (idx, dir) => {
    setForm(f => {
      const imgs = [...f.images]
      const target = idx + dir
      if (target < 0 || target >= imgs.length) return f
      ;[imgs[idx], imgs[target]] = [imgs[target], imgs[idx]]
      return { ...f, images: imgs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      display_order: parseInt(form.display_order) || 0,
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEdit) {
      const { id: _id, created_at, ...rest } = payload
      result = await supabase.from('products').update(rest).eq('id', id)
    } else {
      const { created_at, ...rest } = payload
      result = await supabase.from('products').insert(rest)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
    } else {
      navigate('/admin/urunler')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <Link to="/admin/urunler" className="admin-back-site">← Ürün Listesine Dön</Link>
          <h1>{isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">

          {/* ID */}
          <div className="admin-field admin-field--full">
            <label>Ürün ID (slug) *</label>
            <input
              value={form.id}
              onChange={set('id')}
              placeholder="ornekurunslugi"
              required
              disabled={isEdit}
              pattern="[a-z0-9\-]+"
              title="Sadece küçük harf, rakam ve tire"
            />
            {!isEdit && <small>Küçük harf, rakam, tire. Örnek: hidrolik-egitim-seti. Sonradan değiştirilemez.</small>}
          </div>

          {/* Başlık */}
          <div className="admin-field admin-field--full">
            <label>Başlık *</label>
            <input value={form.title} onChange={set('title')} placeholder="Ürün Adı" required />
          </div>

          {/* Açıklama */}
          <div className="admin-field admin-field--full">
            <label>Açıklama (TR)</label>
            <textarea value={form.description} onChange={set('description')} rows={6} placeholder="Ürün açıklaması..." />
          </div>

          {/* AI Format button */}
          <div className="admin-field admin-field--full" style={{ paddingTop: 4 }}>
            <button
              type="button"
              className="admin-btn-outline"
              onClick={handleFormatDescription}
              disabled={formatting || !form.description?.trim()}
              style={{ width: 'fit-content' }}
            >
              {formatting ? '⏳ Düzenleniyor...' : '✨ AI ile Düzenle'}
            </button>
            <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
              Gemini AI ham metni başlık ve maddelere dönüştürür. Sonucu düzenleyebilirsiniz.
            </small>
          </div>

          {/* Auto-translate button */}
          <div className="admin-field admin-field--full" style={{ paddingTop: 4 }}>
            <button
              type="button"
              className="admin-btn-outline"
              onClick={handleAutoTranslate}
              disabled={translating || !form.title}
              style={{ width: 'fit-content' }}
            >
              {translating ? '⏳ Çevriliyor...' : '🌐 Türkçe\'den İngilizce\'ye Otomatik Çevir'}
            </button>
            <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
              MyMemory API kullanır. Sonuçları kontrol edip düzenleyebilirsiniz.
            </small>
          </div>

          {/* Başlık EN */}
          <div className="admin-field admin-field--full">
            <label>Title (EN) <small style={{ fontWeight: 400, color: '#64748b' }}>— İngilizce PDF için</small></label>
            <input value={form.title_en || ''} onChange={set('title_en')} placeholder="Product name in English" />
          </div>

          {/* Açıklama EN */}
          <div className="admin-field admin-field--full">
            <label>Description (EN) <small style={{ fontWeight: 400, color: '#64748b' }}>— İngilizce PDF için</small></label>
            <textarea value={form.description_en || ''} onChange={set('description_en')} rows={6} placeholder="Product description in English..." />
          </div>

          {/* Görseller */}
          <div className="admin-field admin-field--full">
            <label>Görseller</label>

            {/* Mevcut görseller */}
            {form.images.length > 0 && (
              <div className="image-manager">
                {form.images.map((url, idx) => (
                  <div key={idx} className="image-manager__item">
                    <img src={url} alt={`Görsel ${idx + 1}`} className="image-manager__thumb" />
                    <div className="image-manager__controls">
                      <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0} title="Sola taşı">◀</button>
                      <span className="image-manager__order">{idx + 1}</span>
                      <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === form.images.length - 1} title="Sağa taşı">▶</button>
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="image-manager__delete" title="Kaldır">✕</button>
                    </div>
                    {idx === 0 && <span className="image-manager__main-badge">Ana Görsel</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Upload alanı */}
            <div
              className={`image-upload-zone ${uploading ? 'loading' : ''}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <span className="upload-spinner">Yükleniyor...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" className="upload-icon">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Görsel yüklemek için tıklayın</span>
                  <small>JPEG, PNG, WebP, GIF — max 10MB — çoklu seçim desteklenir</small>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {uploadError && <p className="admin-error">{uploadError}</p>}
          </div>

          {/* Kategori */}
          <div className="admin-field admin-field--full">
            <label>Kategoriler <small style={{ fontWeight: 400, color: '#64748b' }}>(birden fazla seçilebilir)</small></label>
            <div className="category-checkboxes">
              {CATEGORIES.map(cat => (
                <label key={cat.value} className="category-checkbox-item">
                  <input
                    type="checkbox"
                    checked={(form.categories || []).includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          {/* Klasör */}
          <div className="admin-field">
            <label>Klasör (opsiyonel)</label>
            <input value={form.folder} onChange={set('folder')} placeholder="items/Klasör Adı" />
          </div>

          {/* Sıra */}
          <div className="admin-field">
            <label>Görünüm Sırası</label>
            <input type="number" value={form.display_order} onChange={set('display_order')} min={0} />
          </div>

          {/* Aktif */}
          <div className="admin-field admin-field--checkbox">
            <label>
              <input type="checkbox" checked={form.is_active} onChange={setCheck('is_active')} />
              Aktif (sitede görünsün)
            </label>
          </div>

        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={saving || uploading}>
            {saving ? 'Kaydediliyor...' : (isEdit ? 'Değişiklikleri Kaydet' : 'Ürün Ekle')}
          </button>
          <Link to="/admin/urunler" className="admin-btn-outline">İptal</Link>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm
