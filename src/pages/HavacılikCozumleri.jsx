import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../context/LanguageContext';
import './HavacılikCozumleri.css';
import SEO from '../components/SEO';

const SOLUTION_ICONS = {
  atolye: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="30" width="36" height="6" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M12 30V18l12-8 12 8v12" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <rect x="19" y="20" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M24 20v10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
    </svg>
  ),
  'ata-chapter': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M18 18l4 4M30 30l-4-4M30 18l-4 4M18 30l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  simulator: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 34l10-14 8 6 8-10 10 18H6z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 14c0 0-6-8 0-10s0 10 0 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="10" y="38" width="28" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'ozel-uretim': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6l4 8h8l-6.5 6 2.5 8L24 23l-8 5 2.5-8L12 14h8l4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 34l-6 8M32 34l6 8M24 38v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
};

const FEATURED_IDS = [
  'yakitsistemiegitimseti',
  'glasskokpitegitimsetiv2ucakaletleri',
  'antiskidautobrakesistemifonksiyoneltestleriegitims',
];

const HavacılikCozumleri = () => {
  const { products: allProducts, loading } = useProducts({});
  const { lang, t } = useLanguage();
  const pt = (p, field) => (lang !== 'tr' && p[`${field}_${lang}`]) ? p[`${field}_${lang}`] : p[field];

  const SOLUTIONS = [
    {
      id: 'atolye',
      label: t('cozum.sol.atolye.label'),
      desc: t('cozum.sol.atolye.desc'),
      href: '/atolye-egitim-setleri',
      linkText: t('cozum.sol.atolye.link'),
      icon: SOLUTION_ICONS.atolye,
      features: [t('cozum.sol.atolye.f1'), t('cozum.sol.atolye.f2'), t('cozum.sol.atolye.f3'), t('cozum.sol.atolye.f4')],
    },
    {
      id: 'ata-chapter',
      label: t('cozum.sol.ata.label'),
      desc: t('cozum.sol.ata.desc'),
      href: '/ata-chapter-egitim-setleri',
      linkText: t('cozum.sol.ata.link'),
      icon: SOLUTION_ICONS['ata-chapter'],
      features: [t('cozum.sol.ata.f1'), t('cozum.sol.ata.f2'), t('cozum.sol.ata.f3'), t('cozum.sol.ata.f4')],
    },
    {
      id: 'simulator',
      label: t('cozum.sol.sim.label'),
      desc: t('cozum.sol.sim.desc'),
      href: '/simulatorler',
      linkText: t('cozum.sol.sim.link'),
      icon: SOLUTION_ICONS.simulator,
      features: [t('cozum.sol.sim.f1'), t('cozum.sol.sim.f2'), t('cozum.sol.sim.f3'), t('cozum.sol.sim.f4')],
    },
    {
      id: 'ozel-uretim',
      label: t('cozum.sol.ozel.label'),
      desc: t('cozum.sol.ozel.desc'),
      href: '/iletisim',
      linkText: t('cozum.sol.ozel.link'),
      icon: SOLUTION_ICONS['ozel-uretim'],
      features: [t('cozum.sol.ozel.f1'), t('cozum.sol.ozel.f2'), t('cozum.sol.ozel.f3'), t('cozum.sol.ozel.f4')],
    },
  ];

  const WHY = [
    { title: t('cozum.why.1.title'), desc: t('cozum.why.1.desc') },
    { title: t('cozum.why.2.title'), desc: t('cozum.why.2.desc') },
    { title: t('cozum.why.3.title'), desc: t('cozum.why.3.desc') },
    { title: t('cozum.why.4.title'), desc: t('cozum.why.4.desc') },
    { title: t('cozum.why.5.title'), desc: t('cozum.why.5.desc') },
    { title: t('cozum.why.6.title'), desc: t('cozum.why.6.desc') },
  ];

  const STATS = [
    { value: '35+', label: t('cozum.stat.products') },
    { value: '3', label: t('cozum.stat.categories') },
    { value: 'EASA / FAA / SHGM', label: t('cozum.stat.cert') },
    { value: '%100', label: t('cozum.stat.custom') },
  ];

  const featured = FEATURED_IDS
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  const getBadge = (category) => {
    if (category === 'atolye') return t('badge.atolye');
    if (category === 'simulator') return t('badge.simulator');
    return t('badge.ata');
  };

  return (
    <div className="cozumler-page">
      <SEO
        title="Havacılık Çözümleri — Uçtan Uca Eğitim Ekipmanı & Laboratuvar Kurulumu"
        description="Havacılık bakım teknisyeni yetiştiren kurumlar için kapsamlı çözümler. Atölye setleri, sistem simülatörleri, özel üretim ve anahtar teslim laboratuvar kurulumu. HAVEK ile havacılık eğitimini dönüştürün."
        canonical="/havacilik-cozumleri"
      />

      <section className="cozumler-hero">
        <div className="container">
          <p className="cozumler-hero__label">{t('cozum.hero.label')}</p>
          <h1 className="cozumler-hero__title">
            {t('cozum.hero.title').split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
            ))}
          </h1>
          <p className="cozumler-hero__desc">{t('cozum.hero.desc')}</p>
          <div className="cozumler-hero__actions">
            <a href="/iletisim" className="btn-cta-primary">{t('cozum.hero.cta1')}</a>
            <a href="/ata-chapter-egitim-setleri" className="btn-cta-outline">{t('cozum.hero.cta2')}</a>
          </div>
        </div>
      </section>

      <section className="cozumler-solutions">
        <div className="container">
          <div className="cozumler-section-head">
            <h2>{t('cozum.solutions.title')}</h2>
            <p>{t('cozum.solutions.desc')}</p>
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

      <section className="cozumler-why">
        <div className="container">
          <div className="cozumler-section-head">
            <h2>{t('cozum.why.title')}</h2>
            <p>{t('cozum.why.desc')}</p>
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

      {!loading && featured.length > 0 && (
        <section className="cozumler-featured">
          <div className="container">
            <div className="cozumler-section-head">
              <h2>{t('cozum.featured.title')}</h2>
              <p>{t('cozum.featured.desc')}</p>
            </div>
            <div className="cozumler-featured-grid">
              {featured.map(p => (
                <Link key={p.id} to={`/egitim-seti/${p.id}`} state={{ from: '/havacilik-cozumleri', fromLabel: 'Havacılık Çözümleri' }} className="atolye-card-link">
                  <article className="atolye-card">
                    <div className="atolye-card__image-wrap">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="atolye-card__image" />
                      ) : (
                        <div className="atolye-card__no-image">{t('common.noImage')}</div>
                      )}
                      <div className="atolye-card__image-overlay" />
                    </div>
                    <div className="atolye-card__body">
                      <span className="atolye-card__badge">{getBadge(p.category)}</span>
                      <h3 className="atolye-card__title">{pt(p, 'title')}</h3>
                      <p className="atolye-card__desc">
                        {pt(p, 'description') ? pt(p, 'description').replace(/<[^>]+>/g, '').substring(0, 110) + '...' : ''}
                      </p>
                      <div className="atolye-card__footer">
                        <span className="atolye-card__cta">
                          {t('common.viewDetails')}
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

      <section className="cozumler-cta">
        <div className="container">
          <h2>{t('cozum.cta.title')}</h2>
          <p>{t('cozum.cta.desc')}</p>
          <a href="/iletisim" className="btn-cta-primary">{t('cozum.cta.btn')}</a>
        </div>
      </section>

    </div>
  );
};

export default HavacılikCozumleri;
