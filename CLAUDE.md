# HAVEK Projesi — Claude Notları

## Deploy Süreci

- **Otomatik deploy**: `main` branch'e push edince GitHub Actions tetiklenir → build alınır → cPanel FTP'ye upload edilir.
- Workflow dosyası: `.github/workflows/deploy.yml`
- FTP credentials GitHub Secrets'ta saklanır: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- Supabase credentials de Secrets'ta: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Deploy Öncesi Kontrol Listesi

Push etmeden önce şunları kontrol et:

1. **Yeni dosyalar git'e eklendi mi?**  
   `git status` çalıştır — `??` ile başlayan ama kod içinde import edilen dosyalar varsa bunları da `git add` et.

2. **package.json değişti mi?**  
   Yeni paket yüklendiyse `package.json` ve `package-lock.json` mutlaka commit edilmeli.  
   Yoksa CI `npm ci` sırasında paketi bulamaz, build patlar.

3. **Lokal build test et:**  
   `npm run build` — bu başarılıysa CI'da da genellikle geçer.

## Geçmişte Yaşanan Sorunlar

| Sorun | Sebep | Çözüm |
|-------|-------|-------|
| CI'da `Module not found: ../components/SEO` | `SEO.jsx` untracked kalmış, hiç push edilmemişti | `git add src/components/SEO.jsx` ile commit edildi |
| CI'da `react-helmet-async` not found | `package.json` local'de güncellenmiş ama commit edilmemişti | `package.json` + `package-lock.json` commit edildi |
| Breadcrumb `/egitim-setleri` → 404 | Bu route App.jsx'te tanımlı değildi | Her listeleme sayfasına `state={{ from, fromLabel }}` eklendi, ProductDetail bunu okur |

## Proje Yapısı (Özet)

- **Framework**: React + Vite 8
- **Router**: react-router-dom v7
- **Veritabanı**: Supabase
- **Dil yönetimi**: `src/context/LanguageContext.jsx`
- **Admin**: `/admin` path'i altında, ayrı layout
- **Ürün detay route**: `/egitim-seti/:id` — tüm kategoriler bu tek route'u paylaşır
- **Kategoriler**:
  - `atolye` → `/atolye-egitim-setleri`
  - `ata-chapter` → `/ata-chapter-egitim-setleri`
  - `simulator` → `/simulatorler`
