import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import './AtolyeEgitimSetleri.css';

const AtolyeEgitimSetleri = () => {
  const { products, loading } = useProducts({ category: 'atolye' });

  return (
    <div className="atolye-page">

      {/* Hero */}
      <section className="atolye-hero">
        <div className="container">
          <p className="atolye-hero__label">Eğitim Setleri</p>
          <h1 className="atolye-hero__title">Atölye Eğitim Setleri</h1>
          <p className="atolye-hero__desc">
            Gerçek uçak komponentleriyle donatılmış atölye setleri; teknisyen adaylarının
            temel bakım, söküm-takım ve uygulama becerilerini güvenli bir ortamda kazanmasını sağlar.
          </p>
        </div>
      </section>

      {/* Grid */}
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
                    <div className="atolye-card__no-image">Görsel Yok</div>
                  )}
                  <div className="atolye-card__image-overlay" />
                </div>

                <div className="atolye-card__body">
                  <span className="atolye-card__badge">Atölye Seti</span>
                  <h3 className="atolye-card__title">{product.title}</h3>
                  <p className="atolye-card__desc">
                    {product.description
                      ? product.description.replace(/<[^>]+>/g, '').substring(0, 110) + '...'
                      : 'Ürün detayları için tıklayınız.'}
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
        )}
      </section>

      {/* CTA */}
      <section className="cta-section container">
        <div className="cta-content">
          <h2>Laboratuvarınızı Birlikte Kuralım</h2>
          <p>
            Eğitim kurumunuzun ihtiyaçlarına göre özelleştirilmiş atölye düzeni
            ve kurulum desteği sağlıyoruz.
          </p>
          <a href="/iletisim" className="btn-cta">BİZİMLE İLETİŞİME GEÇİN</a>
        </div>
      </section>

    </div>
  );
};

export default AtolyeEgitimSetleri;
