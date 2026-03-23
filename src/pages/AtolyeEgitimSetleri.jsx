import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import './AtolyeEgitimSetleri.css';

const AtolyeEgitimSetleri = () => {
  const { products, loading } = useProducts({ category: 'atolye' });
  const { lang, t } = useLanguage();
  const pt = (p, field) => (lang !== 'tr' && p[`${field}_${lang}`]) ? p[`${field}_${lang}`] : p[field];

  return (
    <div className="atolye-page">

      <section className="atolye-hero">
        <div className="container">
          <p className="atolye-hero__label">{t('atolye.label')}</p>
          <h1 className="atolye-hero__title">{t('atolye.title')}</h1>
          <p className="atolye-hero__desc">{t('atolye.desc')}</p>
        </div>
      </section>

      <section className="atolye-grid-section container">
        {loading ? (
          <div className="atolye-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
        <div className="atolye-grid">
          {products.map((product) => (
            <Link
              to={`/egitim-seti/${product.id}`}
              key={product.id}
              className="atolye-card-link"
            >
              <article className="atolye-card">
                <div className="atolye-card__image-wrap">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="atolye-card__image"
                    />
                  ) : (
                    <div className="atolye-card__no-image">{t('common.noImage')}</div>
                  )}
                  <div className="atolye-card__image-overlay" />
                </div>

                <div className="atolye-card__body">
                  <span className="atolye-card__badge">{t('atolye.badge')}</span>
                  <h3 className="atolye-card__title">{pt(product, 'title')}</h3>
                  <p className="atolye-card__desc">
                    {pt(product, 'description')
                      ? pt(product, 'description').replace(/<[^>]+>/g, '').substring(0, 110) + '...'
                      : t('common.noDesc')}
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
        )}
      </section>

      <section className="cta-section container">
        <div className="cta-content">
          <h2>{t('atolye.cta.title')}</h2>
          <p>{t('atolye.cta.desc')}</p>
          <a href="/iletisim" className="btn-cta">{t('common.contactUs')}</a>
        </div>
      </section>

    </div>
  );
};

export default AtolyeEgitimSetleri;
