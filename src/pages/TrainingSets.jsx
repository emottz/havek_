
import React from 'react';
import { Link } from 'react-router-dom';
import VideoSection from '../components/VideoSection';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import './TrainingSets.css';
import './AtolyeEgitimSetleri.css';

const TrainingSets = () => {
  const { products, loading } = useProducts({ category: 'ata-chapter' });

  return (
    <div className="training-sets-page">
      <section className="video-highlight container" style={{ paddingTop: '100px' }}>
        <VideoSection
          url="https://www.youtube.com/watch?v=UkpCA2NMpvU"
          title="MODÜLER EĞİTİM TEKNOLOJİLERİ"
          description="Uluslararası havacılık standartlarına (ATA) tam uyumlu, modüler eğitim setlerimizle uygulamalı eğitimi modernize ediyoruz. Öğrencilerin teknik becerilerini gerçek sistemler üzerinde geliştirmelerini sağlıyoruz."
          reverse={false}
        />
      </section>

      <section className="catalog-grid-section container">
        <div className="section-header">
          <h2 className="section-title">KATALOG ÜRÜNLERİMİZ</h2>
          <div className="title-underline"></div>
        </div>

        {loading ? (
          <div className="atolye-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
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
                  <span className="atolye-card__badge">ATA Chapter</span>
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
        <div className="cta-content glass-card">
          <h2>Laboratuvarınızı Birlikte Kuralım</h2>
          <p>Eğitim kurumunuzun ihtiyaçlarına göre özelleştirilmiş laboratuvar tasarımı ve kurulum desteği sağlıyoruz.</p>
          <a href="/iletisim" className="btn-cta">KATALOG TALEBİ</a>
        </div>
      </section>
    </div>
  );
};

export default TrainingSets;
