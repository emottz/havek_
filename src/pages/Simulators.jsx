import React from 'react';
import { Link } from 'react-router-dom';
import VideoSection from '../components/VideoSection';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import './TrainingSets.css';
import './AtolyeEgitimSetleri.css';

const Simulators = () => {
  const { products, loading } = useProducts({ category: 'simulator' });

  return (
    <div className="placeholder-page">
      <section className="video-highlight container" style={{ paddingTop: '100px' }}>
        <VideoSection
          url="https://www.youtube.com/watch?v=QmPlSKByVhs"
          title="PROFESYONEL UÇUŞ SİMÜLATÖRLERİ"
          description="EASA / FAA / SHGM standartlarına tam uyumlu, modüler ve ölçeklenebilir simülatör çözümlerimiz. Pilot eğitimi için gerçeğe en yakın uçuş deneyimini uygun maliyetlerle sunuyoruz."
          reverse={false}
        />
      </section>

      <section className="catalog-grid-section container" style={{ marginTop: '4rem' }}>
        <div className="section-header">
          <h2 className="section-title">SİMÜLATÖR ÜRÜNLERİMİZ</h2>
          <div className="title-underline"></div>
        </div>

        {loading ? (
          <div className="atolye-grid">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="atolye-grid">
            {products.map((product) => (
              <Link to={`/egitim-seti/${product.id}`} key={product.id} className="atolye-card-link">
                <article className="atolye-card">
                  <div className="atolye-card__image-wrap">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="atolye-card__image" />
                    ) : (
                      <div className="atolye-card__no-image">Görsel Yok</div>
                    )}
                    <div className="atolye-card__image-overlay" />
                  </div>
                  <div className="atolye-card__body">
                    <span className="atolye-card__badge">Simülatör</span>
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

      <section className="cta-section container">
        <div className="cta-content">
          <h2>İhtiyacınıza Özel Simülatör Tasarımı</h2>
          <p>Okulunuz veya akademiniz için özel konfigürasyonlarda simülatör projelerini hayata geçirebiliriz.</p>
          <a href="/iletisim" className="btn-cta">TEKLİF ALIN</a>
        </div>
      </section>
    </div>
  );
};

export default Simulators;
