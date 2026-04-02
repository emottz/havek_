import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useImageUpload } from '../../hooks/useImageUpload'
import { parseProductHTML } from '../../lib/parseProductHTML'
import { SECTION_TRANSLATIONS } from '../../lib/pdfTranslations'
import './Admin.css'

const LANG_LABELS = { en: 'İngilizce', fr: 'Fransızca', de: 'Almanca' }
const TARGET_LANGS = ['en', 'fr', 'de']

async function translateText(text, targetLang = 'en') {
  if (!text?.trim()) return '';
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    // Response: [[[translated, original, ...]]], join chunks
    const translated = data[0]?.map(chunk => chunk[0]).join('') || text;
    return translated;
  } catch {
    return text;
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const CATEGORIES = [
  { value: 'ata-chapter', label: 'ATA Chapter Bazlı' },
  { value: 'atolye',      label: 'Atölye Eğitim Seti' },
  { value: 'simulator',   label: 'Simülatör' },
]

const EMPTY = {
  id: '', title: '', description: '',
  title_en: '', description_en: '',
  title_fr: '', description_fr: '',
  title_de: '', description_de: '',
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
  const [translating, setTranslating] = useState('')  // '' | 'en' | 'fr' | 'de'
  const [formatting, setFormatting] = useState(false)
  const { upload, remove, uploading, uploadError, setUploadError } = useImageUpload()

  const handleFormatDescription = () => {
    if (!form.description?.trim()) return
    setFormatting(true)

    const raw = form.description

    // Already has HTML tags → strip first
    const plain = raw.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, '\n').trim()

    const lines = plain.split(/\n/).map(l => l.trim()).filter(Boolean)
    let html = ''
    let listItems = []

    const flushList = () => {
      if (listItems.length) {
        html += `<ul>${listItems.map(i => `<li>${i}</li>`).join('')}</ul>`
        listItems = []
      }
    }

    // Patterns
    const isBullet = (l) => /^[-•*]\s+/.test(l) || /^\d+[.)]\s+/.test(l)
    const isHeader = (l) => {
      if (l.length > 80) return false
      if (l.endsWith(':')) return true
      // ALL CAPS or Title Case short line not ending with period
      if (!l.endsWith('.') && l === l.toUpperCase() && l.length > 3) return true
      return false
    }

    let introDone = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (isBullet(line)) {
        const text = line.replace(/^[-•*]\s+/, '').replace(/^\d+[.)]\s+/, '')
        listItems.push(text)
        introDone = true
      } else if (isHeader(line)) {
        flushList()
        const title = line.replace(/:$/, '')
        html += `<h4>${title}</h4>`
        introDone = true
      } else {
        flushList()
        if (!introDone) {
          html += `<p>${line}</p>`
          introDone = true
        } else {
          // Could be a header without colon if next line is bullet
          const nextLine = lines[i + 1]
          if (nextLine && isBullet(nextLine) && line.length <= 80) {
            html += `<h4>${line}</h4>`
          } else {
            html += `<p>${line}</p>`
          }
        }
      }
    }
    flushList()

    setForm(f => ({ ...f, description: html }))
    setFormatting(false)
  }

  const translateToLang = async (lang, { intro, sections }) => {
    const titleTr = form.title
    const translatedTitle = await translateText(titleTr, lang)

    let descHtml = ''
    if (intro) {
      const translatedIntro = await translateText(intro, lang)
      descHtml += `<p>${translatedIntro}</p>`
    }
    for (const sec of sections) {
      const secTitle = SECTION_TRANSLATIONS[lang]?.[sec.title] || await translateText(sec.title, lang)
      const items = []
      for (const item of sec.items) {
        items.push(await translateText(item, lang))
        await sleep(120) // rate limit koruması
      }
      descHtml += `<h4>${secTitle}</h4><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`
    }
    return { title: translatedTitle, desc: descHtml }
  }

  const handleAutoTranslateAll = async () => {
    if (!form.title) return
    const parsed = parseProductHTML(form.description)
    const updates = {}
    try {
      for (const lang of TARGET_LANGS) {
        setTranslating(lang)
        const result = await translateToLang(lang, parsed)
        updates[`title_${lang}`] = result.title
        updates[`description_${lang}`] = result.desc
        await sleep(300)
      }
      setForm(f => ({ ...f, ...updates }))
    } finally {
      setTranslating('')
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
              {formatting ? '⏳ Düzenleniyor...' : '✨ Otomatik Düzenle'}
            </button>
            <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
              Ham metni otomatik olarak başlık ve maddelere dönüştürür. Sonucu düzenleyebilirsiniz.
            </small>
          </div>

          {/* Auto-translate all languages button */}
          <div className="admin-field admin-field--full" style={{ paddingTop: 4 }}>
            <button
              type="button"
              className="admin-btn-outline admin-btn-translate"
              onClick={handleAutoTranslateAll}
              disabled={!!translating || !form.title}
              style={{ width: 'fit-content' }}
            >
              {translating
                ? `⏳ ${LANG_LABELS[translating]} çevriliyor...`
                : '🌐 Tüm Dillere Otomatik Çevir (EN · FR · DE)'}
            </button>
            {translating && (
              <div className="translate-progress">
                {TARGET_LANGS.map(l => (
                  <span key={l} className={`translate-progress__step ${translating === l ? 'active' : TARGET_LANGS.indexOf(l) < TARGET_LANGS.indexOf(translating) ? 'done' : ''}`}>
                    {l.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
            <small style={{ color: '#64748b', marginTop: 4, display: 'block' }}>
              MyMemory API kullanır (ücretsiz). Türkçe içeriği 4 dile çevirir. Sonuçları kontrol edip düzenleyebilirsiniz.
            </small>
          </div>

          {/* Başlık EN */}
          <div className="admin-field admin-field--full">
            <label>Title (EN) <small style={{ fontWeight: 400, color: '#64748b' }}>— İngilizce</small></label>
            <input value={form.title_en || ''} onChange={set('title_en')} placeholder="Product name in English" />
          </div>

          {/* Açıklama EN */}
          <div className="admin-field admin-field--full">
            <label>Description (EN) <small style={{ fontWeight: 400, color: '#64748b' }}>— İngilizce</small></label>
            <textarea value={form.description_en || ''} onChange={set('description_en')} rows={6} placeholder="Product description in English..." />
          </div>

          {/* Başlık FR */}
          <div className="admin-field admin-field--full">
            <label>Titre (FR) 🇫🇷 <small style={{ fontWeight: 400, color: '#64748b' }}>— Fransızca</small></label>
            <input value={form.title_fr || ''} onChange={set('title_fr')} placeholder="Nom du produit en français" />
          </div>

          {/* Açıklama FR */}
          <div className="admin-field admin-field--full">
            <label>Description (FR) 🇫🇷 <small style={{ fontWeight: 400, color: '#64748b' }}>— Fransızca</small></label>
            <textarea value={form.description_fr || ''} onChange={set('description_fr')} rows={6} placeholder="Description du produit en français..." />
          </div>

          {/* Başlık DE */}
          <div className="admin-field admin-field--full">
            <label>Titel (DE) 🇩🇪 <small style={{ fontWeight: 400, color: '#64748b' }}>— Almanca</small></label>
            <input value={form.title_de || ''} onChange={set('title_de')} placeholder="Produktname auf Deutsch" />
          </div>

          {/* Açıklama DE */}
          <div className="admin-field admin-field--full">
            <label>Beschreibung (DE) 🇩🇪 <small style={{ fontWeight: 400, color: '#64748b' }}>— Almanca</small></label>
            <textarea value={form.description_de || ''} onChange={set('description_de')} rows={6} placeholder="Produktbeschreibung auf Deutsch..." />
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
