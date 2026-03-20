import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import './HavacılikCozumleri.css';

/* ── Çözüm alanları ── */
const SOLUTIONS = [
  {
    id: 'atolye',
    label: 'Atölye Eğitim Setleri',
    desc: 'Emniyet teli, contalama, borulama, EWIS ve daha fazlası — teknisyen adaylarına temel bakım becerilerini gerçek komponentlerle kazandıran atölye setleri.',
    href: '/atolye-egitim-setleri',
    linkText: 'Atölye Setlerini İncele',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="30" width="36" height="6" rx="2" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M12 30V18l12-8 12 8v12" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <rect x="19" y="20" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M24 20v10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
      </svg>
    ),
    features: ['EWIS & Harness Uygulamaları', 'Emniyet Teli & Torklama', 'Contalama & Yağlama', 'Perçinleme & Saç Metal'],
  },
  {
    id: 'ata-chapter',
    label: 'ATA Chapter Bazlı Setler',
    desc: 'Hidrolik, yakıt, pnömatik, elektrik, oksijen ve daha pek çok sistem — AMM prosedürleri birebir uygulanabilen kapsamlı sistem eğitim setleri.',
    href: '/ata-chapter-egitim-setleri',
    linkText: 'Sistem Setlerini İncele',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M18 18l4 4M30 30l-4-4M30 18l-4 4M18 30l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    features: ['Yakıt & Hidrolik Sistemler', 'Pnömatik & Klima', 'Elektrik & Aviyonik', 'Yangın & Oksijen Sistemleri'],
  },
  {
    id: 'simulator',
    label: 'Simülatörler',
    desc: 'Uçuş simülatörü kabinleri ve rüzgar tünelinden oluşan simülatör çözümleri; teorik bilgiyi gerçeğe yakın ortamda pekiştirir.',
    href: '/simulatorler',
    linkText: 'Simülatörleri İncele',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 34l10-14 8 6 8-10 10 18H6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M24 14c0 0-6-8 0-10s0 10 0 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="10" y="38" width="28" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    features: ['Cessna Tipi Uçuş Kabini', 'Rüzgar Tüneli', 'Aerodinamik Eğitim', 'Pilot & Ko-pilot Konfigürasyonu'],
  },
  {
    id: 'ozel-uretim',
    label: 'Özel Üretim & Hizmetler',
    desc: '3D tasarım, lazer kesim ve özel imalat hizmetleriyle kurumunuza özgü eğitim ekipmanları üretiyoruz. Her proje ihtiyaca göre şekillenir.',
    href: '/iletisim',
    linkText: 'Teklif Alın',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6l4 8h8l-6.5 6 2.5 8L24 23l-8 5 2.5-8L12 14h8l4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M16 34l-6 8M32 34l6 8M24 38v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    features: ['3D Tasarım & İmalat', 'Lazer Kesim & Şekillendirme', 'Özel Panel & Stand Üretimi', 'Mevcut Sisteme Entegrasyon'],
  },
];

/* ── Neden HAVEK ── */
const WHY = [
  { title: 'EASA / FAA / SHGM Uyumlu', desc: 'Part-145 ve Part-147 sertifika gerekliliklerine tam uygun prosedür ve donanım.' },
  { title: 'Gerçek Uçak Komponentleri', desc: 'Ömrünü tamamlamış gerçek uçak parçaları revize edilerek setlere entegre edilir.' },
  { title: 'Kuruma Özel Tasarım', desc: 'Her eğitim setinin içeriği, kurumun müfredatı ve önceliklerine göre konfigure edilir.' },
  { title: 'Teknik Destek & Bakım', desc: 'Teslimat sonrası teknik destek, yedek parça temini ve saha bakım hizmetleri sunulur.' },
  { title: 'Belgelenmiş AMM Prosedürleri', desc: 'Tüm uygulamalar onaylı bakım el kitabı (AMM) görevleriyle örtüşecek şekilde tasarlanır.' },
  { title: 'Türkiye\'nin Öncü Üreticisi', desc: 'Havacılık eğitim ekipmanı alanında Türkiye\'nin deneyimli ve referanslı üreticisi.' },
];

/* ── İstatistikler ── */
const STATS = [
  { value: '35+', label: 'Eğitim Seti & Ürün' },
  { value: '3', label: 'Çözüm Kategorisi' },
  { value: 'EASA / FAA / SHGM', label: 'Sertifika Uyumluluğu' },
  { value: '%100', label: 'Özelleştirilebilir' },
];

/* ── Öne çıkan ürün ID'leri ── */
const FEATURED_IDS = [
  'yakitsistemiegitimseti',
  'glasskokpitegitimsetiv2ucakaletleri',
  'antiskidautobrakesistemifonksiyoneltestleriegitims',
];

const HavacılikCozumleri = () => {
  const { products: allProducts, loading } = useProducts({});

  const featured = FEATURED_IDS
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="cozumler-page">

      {/* ── Hero ── */}
      <section className="cozumler-hero">
        <div className="container">
          <p className="cozumler-hero__label">Havacılık Çözümleri</p>
          <h1 className="cozumler-hero__title">
            Havacılık Eğitimine Özel<br />Uçtan Uca Çözümler
          </h1>
          <p className="cozumler-hero__desc">
            HAVEK olarak, havacılık bakım teknisyeni yetiştiren kurum ve kuruluşlara
            atölye setlerinden sistem simülatörlerine, özel üretimden teknik desteğe
            kadar kapsamlı eğitim ekipmanı çözümleri sunuyoruz.
          </p>
          <div className="cozumler-hero__actions">
            <a href="/iletisim" className="btn-cta-primary">Çözüm Teklifi Alın</a>
            <a href="/ata-chapter-egitim-setleri" className="btn-cta-outline">Ürün Kataloğu</a>
          </div>
        </div>
      </section>

      {/* ── Çözüm Alanları ── */}
      <section className="cozumler-solutions">
        <div className="container">
        <div className="cozumler-section-head">
          <h2>Çözüm Alanlarımız</h2>
          <p>Havacılık eğitiminin her boyutuna yönelik, ihtiyaca göre şekillenen ürün ve hizmetler.</p>
        </div>
        <div className="cozumler-solutions-grid">
          {SOLUTIONS.map(sol => (
            <div key={sol.id} className="cozumler-sol-card">
              <div className="cozumler-sol-card__icon">{sol.icon}</div>
              <h3 className="cozumler-sol-card__title">{sol.label}</h3>
              <p className="cozumler-sol-card__desc">{sol.desc}</p>
              <ul className="cozumler-sol-card__features">
                {sol.features.map(f => (
                  <li key={f}>
                    <CheckCircle size={13} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={sol.href} className="cozumler-sol-card__link">
                {sol.linkText} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── İstatistikler ── */}
      <section className="cozumler-stats">
        <div className="container">
          {STATS.map(s => (
            <div key={s.label} className="cozumler-stat">
              <span className="cozumler-stat__value">{s.value}</span>
              <span className="cozumler-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Neden HAVEK ── */}
      <section className="cozumler-why">
        <div className="container">
          <div className="cozumler-section-head">
            <h2>Neden HAVEK?</h2>
            <p>Havacılık eğitim ekipmanı seçiminde fark yaratan özelliklerimiz.</p>
          </div>
          <div className="cozumler-why-grid">
            {WHY.map(w => (
              <div key={w.title} className="cozumler-why-card">
                <div className="cozumler-why-card__dot" />
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Öne Çıkan Ürünler ── */}
      {!loading && featured.length > 0 && (
        <section className="cozumler-featured">
          <div className="container">
            <div className="cozumler-section-head">
              <h2>Öne Çıkan Ürünler</h2>
              <p>En kapsamlı ve tercih edilen eğitim setlerimizden bir seçki.</p>
            </div>
            <div className="cozumler-featured-grid">
              {featured.map(p => (
                <Link key={p.id} to={`/egitim-seti/${p.id}`} className="atolye-card-link">
                  <article className="atolye-card">
                    <div className="atolye-card__image-wrap">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="atolye-card__image" />
                      ) : (
                        <div className="atolye-card__no-image">Görsel Yok</div>
                      )}
                      <div className="atolye-card__image-overlay" />
                    </div>
                    <div className="atolye-card__body">
                      <span className="atolye-card__badge">{p.category === 'atolye' ? 'Atölye Seti' : p.category === 'simulator' ? 'Simülatör' : 'ATA Chapter'}</span>
                      <h3 className="atolye-card__title">{p.title}</h3>
                      <p className="atolye-card__desc">
                        {p.description ? p.description.replace(/<[^>]+>/g, '').substring(0, 110) + '...' : ''}
                      </p>
                      <div className="atolye-card__footer">
                        <span className="atolye-card__cta">
                          Detayları İncele
                          <svg viewBox="0 0 16 16" fill="none" className="atolye-card__arrow">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="cozumler-cta">
        <div className="container">
          <h2>Kurumunuza Özel Çözüm Arayışında mısınız?</h2>
          <p>
            Müfredatınıza ve bütçenize uygun eğitim ekipmanı paketleri için
            uzman ekibimizle iletişime geçin.
          </p>
          <a href="/iletisim" className="btn-cta-primary">Teklif & Bilgi Alın</a>
        </div>
      </section>

    </div>
  );
};

export default HavacılikCozumleri;
