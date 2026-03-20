import React, { useState, useEffect, useCallback, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useProducts } from '../hooks/useProducts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { parseProductHTML } from '../lib/parseProductHTML';
import { SECTION_TR_TO_EN, CATEGORY_EN } from '../lib/pdfTranslations';
import CatalogPDF from '../components/CatalogPDF';
import './OnlineKatalog.css';

/* ── Sabitler ── */
const CATEGORY_ORDER = ['simulator', 'atolye', 'ata-chapter'];

const CAT_LABEL = {
  tr: { simulator: 'Simülatörler', atolye: 'Atölye Eğitim Setleri', 'ata-chapter': 'ATA Chapter Bazlı Setler' },
  en: { simulator: 'Simulators',   atolye: 'Workshop Training Sets', 'ata-chapter': 'ATA Chapter Based Sets'   },
};
const CAT_BADGE = {
  tr: { simulator: 'Simülatör', atolye: 'Atölye Seti', 'ata-chapter': 'ATA Chapter' },
  en: { simulator: 'Simulator', atolye: 'Workshop Set', 'ata-chapter': 'ATA Chapter' },
};
const CAT_DESC = {
  tr: {
    simulator:     'Cessna tipi uçuş kabini ve rüzgar tüneli dahil simülatör çözümleri.',
    atolye:        'Emniyet teli, contalama, borulama, EWIS ve perçinleme uygulamaları.',
    'ata-chapter': 'Hidrolik, yakıt, pnömatik, elektrik ve oksijen sistem eğitim setleri.',
  },
  en: {
    simulator:     'Simulator solutions including Cessna-type cockpit and wind tunnel.',
    atolye:        'Safety wire, sealing, tubing, EWIS and riveting applications.',
    'ata-chapter': 'Hydraulic, fuel, pneumatic, electrical and oxygen system training sets.',
  },
};

const getCat = (p) => p.categories?.[0] || p.category || '';
const getTitle = (p, lang) => lang === 'en' ? (p.title_en || p.title) : p.title;
const getDesc  = (p, lang) => lang === 'en' ? (p.description_en || p.description) : p.description;
const translateSection = (title, lang) => lang === 'en' ? (SECTION_TR_TO_EN[title] || title) : title;
const catBadge = (cat, lang) => lang === 'en' ? (CATEGORY_EN[cat] || cat) : (CAT_BADGE.tr[cat] || cat);

/* ── Sayfa tipleri ── */
function buildPages(products) {
  const pages = [{ type: 'cover' }, { type: 'toc' }];
  CATEGORY_ORDER.forEach((cat, idx) => {
    const catProducts = products.filter(p => getCat(p) === cat);
    if (!catProducts.length) return;
    pages.push({ type: 'section', cat, idx: idx + 1 });
    catProducts.forEach(p => pages.push({ type: 'product', product: p }));
  });
  const other = products.filter(p => !CATEGORY_ORDER.includes(getCat(p)));
  if (other.length) {
    pages.push({ type: 'section', cat: 'other', idx: CATEGORY_ORDER.length + 1 });
    other.forEach(p => pages.push({ type: 'product', product: p }));
  }
  pages.push({ type: 'back' });
  return pages;
}

const fetchAsDataUrl = async (src) => {
  const url = src.startsWith('/') ? `${window.location.origin}${src}` : src;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch { return null; }
};
const yieldToMain = () => new Promise(r => setTimeout(r, 0));

/* ════════════════════════════════════
   SAYFA BİLEŞENLERİ
════════════════════════════════════ */

/* Kapak */
const CoverPage = ({ products, lang }) => {
  const coverProducts = products.filter(p => p.images?.[0]).slice(0, 2);
  return (
    <div className="ck-cover">
      <div className="ck-cover__main">
        <div className="ck-cover__top">
          <img src={`${import.meta.env.BASE_URL}Beyaz_logo.png`} alt="HAVEK" className="ck-cover__logo" />
          <span className="ck-cover__year">2025</span>
        </div>
        <p className="ck-cover__tag">HAVEK</p>
        <h1 className="ck-cover__title">
          {lang === 'tr' ? 'Ürün Kataloğu' : 'Product Catalog'}
        </h1>
        <p className="ck-cover__sub">
          {lang === 'tr' ? 'Havacılık Eğitim Ekipmanları' : 'Aviation Training Equipment'}
        </p>
        {coverProducts.length > 0 && (
          <div className="ck-cover__imgs">
            {coverProducts.map((p, i) => (
              <img key={i} src={p.images[0]} alt={p.title} className="ck-cover__img" />
            ))}
          </div>
        )}
      </div>
      <div className="ck-cover__bottom">
        <span>www.havek.tr</span>
        <span>info@havek.com.tr</span>
        <span className="ck-cover__bottom-blue">HAVEK © 2025</span>
      </div>
    </div>
  );
};

/* İçindekiler */
const TOCPage = ({ products, lang }) => {
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    label: CAT_LABEL[lang][cat],
    products: products.filter(p => getCat(p) === cat),
  })).filter(g => g.products.length > 0);

  return (
    <div className="ck-page">
      <div className="ck-header">
        <img src={`${import.meta.env.BASE_URL}Beyaz_logo.png`} alt="HAVEK" className="ck-header__logo" />
        <span className="ck-header__right">{lang === 'tr' ? 'İçindekiler' : 'Table of Contents'}</span>
      </div>
      <div className="ck-accent-bar" />
      <div className="ck-body">
        <h2 className="ck-toc__title">{lang === 'tr' ? 'İçindekiler' : 'Table of Contents'}</h2>
        {grouped.map(g => (
          <div key={g.cat} className="ck-toc__section">
            <div className="ck-toc__section-head">
              <span className="ck-toc__bar" />
              <span className="ck-toc__cat-name">{g.label}</span>
              <span className="ck-toc__cat-count">{g.products.length}</span>
            </div>
            {g.products.map(p => (
              <div key={p.id} className="ck-toc__item">
                <span className="ck-toc__dot" />
                <span className="ck-toc__item-name">{getTitle(p, lang)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ck-footer">
        <img src={`${import.meta.env.BASE_URL}Siyah_logo.png`} alt="HAVEK" className="ck-footer__logo" />
        <span className="ck-footer__text">www.havek.tr</span>
      </div>
    </div>
  );
};

/* Bölüm ayraç */
const SectionPage = ({ cat, idx, lang }) => (
  <div className="ck-section">
    <div className="ck-section__num">{String(idx).padStart(2, '0')}</div>
    <div className="ck-section__accent" />
    <p className="ck-section__tag">HAVEK</p>
    <h2 className="ck-section__title">{CAT_LABEL[lang][cat] || cat}</h2>
    <p className="ck-section__desc">{CAT_DESC[lang]?.[cat] || ''}</p>
  </div>
);

/* Ürün sayfası */
const ProductPage = ({ product, lang, email }) => {
  const rawDesc = getDesc(product, lang);
  const { intro, sections } = parseProductHTML(rawDesc);
  const half = Math.ceil(sections.length / 2);
  const left  = sections.slice(0, half);
  const right = sections.slice(half);
  const cats  = product.categories || [];
  const images = (product.images || []).filter(Boolean).slice(0, 3);

  return (
    <div className="ck-page">
      <div className="ck-header">
        <img src={`${import.meta.env.BASE_URL}Beyaz_logo.png`} alt="HAVEK" className="ck-header__logo" />
        <span className="ck-header__doc-label">
          {lang === 'tr' ? 'TEKNİK ÜRÜN FÖYÜ' : 'TECHNICAL DATA SHEET'}
        </span>
      </div>
      <div className="ck-accent-bar" />

      <div className="ck-body">
        {cats.length > 0 && (
          <div className="ck-chips">
            {cats.map(c => (
              <span key={c} className="ck-chip">{catBadge(c, lang)}</span>
            ))}
          </div>
        )}

        <h2 className="ck-product__title">{getTitle(product, lang)}</h2>
        <div className="ck-divider" />

        {intro && <p className="ck-product__intro">{intro}</p>}

        {images.length > 0 && (
          <div className="ck-product__imgs">
            {images.map((src, i) => (
              <img key={i} src={src} alt={getTitle(product, lang)} className="ck-product__img" loading="lazy" />
            ))}
          </div>
        )}

        {sections.length > 0 && (
          <div className="ck-two-col">
            <div className="ck-col">
              {left.map((sec, i) => (
                <div key={i} className="ck-section-block">
                  {sec.title && (
                    <div className="ck-section-block__head">
                      <span>{translateSection(sec.title, lang)}</span>
                    </div>
                  )}
                  {sec.items.map((item, j) => (
                    <div key={j} className="ck-item-row">
                      <span className="ck-bullet">›</span>
                      <span className="ck-item-text">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="ck-col">
              {right.map((sec, i) => (
                <div key={i} className="ck-section-block">
                  {sec.title && (
                    <div className="ck-section-block__head">
                      <span>{translateSection(sec.title, lang)}</span>
                    </div>
                  )}
                  {sec.items.map((item, j) => (
                    <div key={j} className="ck-item-row">
                      <span className="ck-bullet">›</span>
                      <span className="ck-item-text">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ck-info-box">
          <div>
            <span className="ck-info-box__label">{lang === 'tr' ? 'UYUMLULUK' : 'COMPLIANCE'}</span>
            <span className="ck-info-box__value">EASA Part-145 / FAA</span>
          </div>
          <div>
            <span className="ck-info-box__label">{lang === 'tr' ? 'ÖZELLEŞTİRME' : 'CUSTOMIZABLE'}</span>
            <span className="ck-info-box__value">{lang === 'tr' ? '%100 Özelleştirilebilir' : '100% Customizable'}</span>
          </div>
          <div>
            <span className="ck-info-box__label">{lang === 'tr' ? 'İLETİŞİM' : 'CONTACT'}</span>
            <span className="ck-info-box__value">{email}</span>
          </div>
        </div>
      </div>

      <div className="ck-footer">
        <img src={`${import.meta.env.BASE_URL}Siyah_logo.png`} alt="HAVEK" className="ck-footer__logo" />
        <span className="ck-footer__text">www.havek.tr</span>
        <span className="ck-footer__text">
          {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

/* Arka kapak */
const BackPage = ({ lang, email }) => (
  <div className="ck-back">
    <img src={`${import.meta.env.BASE_URL}Beyaz_logo.png`} alt="HAVEK" className="ck-back__logo" />
    <div className="ck-back__divider" />
    <h2 className="ck-back__title">
      {lang === 'tr' ? 'Bizimle İletişime Geçin' : 'Get In Touch'}
    </h2>
    <p className="ck-back__cta">
      {lang === 'tr'
        ? 'Müfredatınıza ve bütçenize uygun eğitim ekipmanı paketleri için uzman ekibimizle iletişime geçin.'
        : 'Contact our expert team for training equipment packages tailored to your curriculum and budget.'}
    </p>
    <span className="ck-back__website">www.havek.tr</span>
    <span className="ck-back__email">{email}</span>
  </div>
);

/* ════════════════════════════════════
   ANA BİLEŞEN
════════════════════════════════════ */
const OnlineKatalog = () => {
  const { products, loading } = useProducts({});
  const { settings } = useSiteSettings();
  const email = settings.email || 'info@havek.com.tr';
  const [lang, setLang]    = useState('tr');
  const [pageIdx, setPageIdx] = useState(0);
  const [pdfState, setPdfState] = useState('idle'); // idle | fetching | building
  const [pdfProgress, setPdfProgress] = useState(0);
  const pageRef = useRef(null);

  const pages = loading ? [] : buildPages(products);
  const total = pages.length;
  const current = pages[pageIdx] || null;

  /* Sayfa değişince en üste kaydır */
  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
  }, [pageIdx]);

  /* Klavye navigasyonu */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') setPageIdx(i => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft')  setPageIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [total]);

  const prev = useCallback(() => setPageIdx(i => Math.max(i - 1, 0)), []);
  const next = useCallback(() => setPageIdx(i => Math.min(i + 1, total - 1)), [total]);

  /* PDF İndir */
  const handleDownloadPdf = async () => {
    if (pdfState !== 'idle') return;
    setPdfState('fetching');
    setPdfProgress(0);

    /* Logo base64 */
    const logoUrl = await fetchAsDataUrl('/Beyaz_logo.png');

    /* Ürün başına 1 görsel — base64 (renderer CORS'tan bağımsız, daha az bellek) */
    const toFetch = products.filter(p => p.images?.length > 0);
    const catalogImages = {};
    let done = 0;

    for (let i = 0; i < toFetch.length; i += 6) {
      const batch = toFetch.slice(i, i + 6);
      await Promise.all(batch.map(async p => {
        const src = (p.images || []).filter(Boolean)[0];
        if (!src) return;
        const dataUrl = await fetchAsDataUrl(src);
        if (dataUrl) catalogImages[p.id] = [dataUrl];
      }));
      done += batch.length;
      setPdfProgress(Math.round((done / toFetch.length) * 75));
      await yieldToMain();
    }

    setPdfState('building');
    setPdfProgress(85);
    await yieldToMain();

    try {
      const blob = await pdf(
        <CatalogPDF
          products={products}
          lang={lang}
          catalogImages={catalogImages}
          logoDataUrl={logoUrl}
          email={email}
        />
      ).toBlob();
      setPdfProgress(100);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = lang === 'tr' ? 'HAVEK_Urun_Katalogu_TR_2025.pdf' : 'HAVEK_Product_Catalog_EN_2025.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setPdfState('idle');
      setPdfProgress(0);
    }
  };

  const isBusy = pdfState !== 'idle';
  const pdfLabel = pdfState === 'fetching'
    ? `${lang === 'tr' ? 'Hazırlanıyor' : 'Preparing'} ${pdfProgress}%`
    : pdfState === 'building'
      ? (lang === 'tr' ? 'Oluşturuluyor…' : 'Building…')
      : (lang === 'tr' ? 'PDF İndir' : 'Download PDF');

  /* Sayfa render */
  const renderPage = () => {
    if (!current) return null;
    switch (current.type) {
      case 'cover':   return <CoverPage products={products} lang={lang} />;
      case 'toc':     return <TOCPage products={products} lang={lang} />;
      case 'section': return <SectionPage cat={current.cat} idx={current.idx} lang={lang} />;
      case 'product': return <ProductPage product={current.product} lang={lang} email={email} />;
      case 'back':    return <BackPage lang={lang} email={email} />;
      default:        return null;
    }
  };

  return (
    <div className="katalog-page">

      {/* ── Araç çubuğu ── */}
      <div className="katalog-toolbar">
        <div className="katalog-toolbar-left">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2e6da4"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span className="katalog-toolbar-title">
            {lang === 'tr' ? 'HAVEK Ürün Kataloğu' : 'HAVEK Product Catalog'}
          </span>
        </div>
        <div className="katalog-toolbar-right">
          <div className="katalog-lang-toggle">
            <button className={`katalog-lang-btn ${lang === 'tr' ? 'active' : ''}`} onClick={() => { setLang('tr'); setPageIdx(0); }}>TR</button>
            <button className={`katalog-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => { setLang('en'); setPageIdx(0); }}>EN</button>
          </div>
          <button className="katalog-download-btn" onClick={handleDownloadPdf} disabled={isBusy || loading}>
            {isBusy ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'kspin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            )}
            {pdfLabel}
          </button>
        </div>
      </div>

      {/* PDF progress — always rendered to avoid layout shift */}
      <div className="katalog-pdf-progress">
        <div className="katalog-pdf-progress__fill" style={{ width: isBusy ? `${pdfProgress}%` : '0%', opacity: isBusy ? 1 : 0 }} />
      </div>

      {/* ── Görüntüleyici ── */}
      <div className="katalog-viewer">

        <div className="katalog-page-outer">
          {/* Sol ok */}
          <button className="katalog-nav katalog-nav--prev" onClick={prev} disabled={pageIdx === 0} aria-label="Önceki sayfa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* A4 sayfa */}
          <div className="katalog-page-wrap" ref={pageRef}>
            {loading ? (
              <div className="katalog-page-skeleton">
                <div className="katalog-skeleton-header" />
                <div className="katalog-skeleton-body">
                  {[80, 40, 100, 60, 100, 70].map((w, i) => (
                    <div key={i} className="katalog-skeleton-line" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="katalog-page-content" key={`${lang}-${pageIdx}`}>
                {renderPage()}
              </div>
            )}
          </div>

          {/* Sağ ok */}
          <button className="katalog-nav katalog-nav--next" onClick={next} disabled={pageIdx === total - 1} aria-label="Sonraki sayfa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Sayfa numarası */}
        {total > 0 && (
          <div className="katalog-page-num">{pageIdx + 1} / {total}</div>
        )}

      </div>
    </div>
  );
};

export default OnlineKatalog;
