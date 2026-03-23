import React, { useState } from 'react';
import './Home.css';
import './AtolyeEgitimSetleri.css';
import HeroSlider from '../components/HeroSlider';
import VideoSection from '../components/VideoSection';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const VISIBLE = 3;

const Home = () => {
  const { lang, t } = useLanguage();
  const pt = (p, field) => (lang === 'en' && p[`${field}_en`]) ? p[`${field}_en`] : p[field];
  const { products, loading } = useProducts();
  const [slideIndex, setSlideIndex] = useState(0);
  const { products: atolyeProds } = useProducts({ category: 'atolye' });
  const { products: ataProds }    = useProducts({ category: 'ata-chapter' });
  const { products: simProds }    = useProducts({ category: 'simulator' });

  const featuredProducts = products
    .filter(p => p.images && p.images.length > 0)
    .slice(0, 8);

  const maxIndex = Math.max(0, featuredProducts.length - VISIBLE);
  const prevSlide = () => setSlideIndex(i => Math.max(0, i - 1));
  const nextSlide = () => setSlideIndex(i => Math.min(maxIndex, i + 1));

  const getImgs = (prods, count = 3) =>
    prods.filter(p => p.images?.length > 0).flatMap(p => p.images).slice(0, count);

  const CATEGORIES = [
    {
      label: t('home.cat.workshop.label'),
      sub: t('home.cat.workshop.sub'),
      desc: t('home.cat.workshop.desc'),
      to: '/atolye-egitim-setleri',
      imgs: getImgs(atolyeProds),
      fallback: 'linear-gradient(135deg,#1c2b3a 0%,#2e6da4 100%)',
    },
    {
      label: t('home.cat.ata.label'),
      sub: t('home.cat.ata.sub'),
      desc: t('home.cat.ata.desc'),
      to: '/ata-chapter-egitim-setleri',
      imgs: getImgs(ataProds),
      fallback: 'linear-gradient(135deg,#0f2a1a 0%,#1a5c38 100%)',
    },
    {
      label: t('home.cat.sim.label'),
      sub: t('home.cat.sim.sub'),
      desc: t('home.cat.sim.desc'),
      to: '/simulatorler',
      imgs: getImgs(simProds),
      fallback: 'linear-gradient(135deg,#1a1040 0%,#2e3a8a 100%)',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <HeroSlider />
      </section>

      <div className="cat-section">
        <div className="section-header">
          <h2 className="section-title">{t('home.categoriesTitle')}</h2>
          <div className="title-underline"></div>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="cat-card"
              style={cat.imgs.length === 0 ? { background: cat.fallback } : {}}
            >
              {cat.imgs.length > 0 && (
                <div className={`cat-card__mosaic cat-card__mosaic--${Math.min(cat.imgs.length, 3)}`}>
                  {cat.imgs.slice(0, 3).map((src, i) => (
                    <div
                      key={i}
                      className="cat-card__mosaic-img"
                      style={{ backgroundImage: `url("${src}")` }}
                    />
                  ))}
                </div>
              )}
              <div className="cat-card__overlay" />
              <div className="cat-card__content">
                <span className="cat-card__sub">{cat.sub}</span>
                <h3 className="cat-card__title">{cat.label}</h3>
                <p className="cat-card__desc">{cat.desc}</p>
                <span className="cat-card__cta">
                  {t('common.explore')}
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <section className="video-highlight container">
        <VideoSection
          url="https://www.youtube.com/watch?v=QmPlSKByVhs"
          title={t('home.video1.title')}
          description={t('home.video1.desc')}
          reverse={false}
        />
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">{t('home.featuredTitle')}</h2>
          <div className="title-underline"></div>
        </div>

        {/* ── Desktop Slider ── */}
        <div className="featured-carousel">
          <button
            className="featured-carousel__arrow featured-carousel__arrow--prev"
            onClick={prevSlide}
            disabled={slideIndex === 0}
            aria-label="Önceki"
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="featured-carousel__viewport">
            <div
              className="featured-carousel__track"
              style={{ transform: `translateX(-${slideIndex * (100 / VISIBLE)}%)` }}
            >
              {loading
                ? Array.from({ length: VISIBLE }).map((_, i) => (
                    <div key={i} className="featured-carousel__slide"><SkeletonCard /></div>
                  ))
                : featuredProducts.map((product) => (
                    <div key={product.id} className="featured-carousel__slide">
                      <Link to={`/egitim-seti/${product.id}`} className="atolye-card-link">
                        <article className="atolye-card">
                          <div className="atolye-card__image-wrap">
                            <img src={product.images[0]} alt={pt(product, 'title')} className="atolye-card__image" />
                            <div className="atolye-card__image-overlay" />
                          </div>
                          <div className="atolye-card__body">
                            <span className="atolye-card__badge">{t('home.badge.trainingSet')}</span>
                            <h3 className="atolye-card__title">{pt(product, 'title')}</h3>
                            <p className="atolye-card__desc">
                              {pt(product, 'description')
                                ? pt(product, 'description').replace(/<[^>]+>/g, '').substring(0, 100) + '...'
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
                    </div>
                  ))}
            </div>
          </div>

          <button
            className="featured-carousel__arrow featured-carousel__arrow--next"
            onClick={nextSlide}
            disabled={slideIndex >= maxIndex}
            aria-label="Sonraki"
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* ── Mobile Grid ── */}
        <div className="featured-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.slice(0, 6).map((product) => (
                <Link key={product.id} to={`/egitim-seti/${product.id}`} className="atolye-card-link">
                  <article className="atolye-card">
                    <div className="atolye-card__image-wrap">
                      <img src={product.images[0]} alt={pt(product, 'title')} className="atolye-card__image" />
                      <div className="atolye-card__image-overlay" />
                    </div>
                    <div className="atolye-card__body">
                      <span className="atolye-card__badge">{t('home.badge.trainingSet')}</span>
                      <h3 className="atolye-card__title">{pt(product, 'title')}</h3>
                      <p className="atolye-card__desc">
                        {pt(product, 'description')
                          ? pt(product, 'description').replace(/<[^>]+>/g, '').substring(0, 100) + '...'
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
      </section>

      <section className="video-highlight secondary-video container">
        <VideoSection
          url="https://www.youtube.com/watch?v=UkpCA2NMpvU"
          title={t('home.video2.title')}
          description={t('home.video2.desc')}
          reverse={true}
        />
      </section>

      <section className="cta-section container">
        <div className="cta-content">
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.desc')}</p>
          <a href="/iletisim" className="btn-cta">{t('common.contactUs')}</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
