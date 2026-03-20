import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';
import './AtolyeEgitimSetleri.css';
import HeroSlider from '../components/HeroSlider';
import VideoSection from '../components/VideoSection';
import { useProducts } from '../hooks/useProducts';
import { SkeletonCard } from '../components/Skeleton';
import { Link } from 'react-router-dom';

const Home = () => {
  const { products, loading } = useProducts();
  const { products: atolyeProds } = useProducts({ category: 'atolye' });
  const { products: ataProds }    = useProducts({ category: 'ata-chapter' });
  const { products: simProds }    = useProducts({ category: 'simulator' });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const featuredProducts = products
    .filter(p => p.images && p.images.length > 0)
    .slice(0, 8);

  const getImgs = (prods, count = 3) =>
    prods.filter(p => p.images?.length > 0).flatMap(p => p.images).slice(0, count);

  const CATEGORIES = [
    {
      label: 'Atölye Eğitim Setleri',
      sub: 'Hands-on / Pratik Eğitim',
      desc: 'Gerçek bileşenlerle donatılmış, uygulamalı beceri kazandıran atölye düzenekleri.',
      to: '/atolye-egitim-setleri',
      imgs: getImgs(atolyeProds),
      fallback: 'linear-gradient(135deg,#1c2b3a 0%,#2e6da4 100%)',
    },
    {
      label: 'ATA Chapter Bazlı',
      sub: 'Sistem Odaklı Eğitim',
      desc: 'Uluslararası ATA standardına göre bölümlendirilmiş modüler sistem eğitim setleri.',
      to: '/ata-chapter-egitim-setleri',
      imgs: getImgs(ataProds),
      fallback: 'linear-gradient(135deg,#0f2a1a 0%,#1a5c38 100%)',
    },
    {
      label: 'Simülatörler',
      sub: 'FAA & EASA Uyumlu',
      desc: 'Pilot ve teknisyen eğitimi için gerçeğe en yakın simülasyon sistemleri.',
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
        <div className="cat-section__header">
          <h2 className="cat-section__title">Ürün Kategorilerimiz</h2>
          <p className="cat-section__sub">İhtiyacınıza göre kategori seçin</p>
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
                  Keşfet
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Video 1: Profesyonel Uçuş Çözümleri */}
      <section className="video-highlight container">
        <VideoSection 
          url="https://www.youtube.com/watch?v=QmPlSKByVhs"
          title="PROFESYONEL UÇUŞ ÇÖZÜMLERİ"
          description="Simülasyon teknolojilerinde sınırları zorlayan, pilot eğitimi ve aviyonik bakımda mükemmeliyeti hedefleyen mühendislik harikası ürünlerimizi keşfedin. FAA ve EASA uyumlu çözümlerle havacılık eğitimini bir üst seviyeye taşıyoruz."
          reverse={false}
        />
      </section>

      {/* NEW: Expanded Products Section */}
      <section className="popular-products container">
        <div className="section-header">
          <h2 className="section-title">ÖNE ÇIKAN EĞİTİM SETLERİ</h2>
          <div className="title-underline"></div>
        </div>

        <div className="product-carousel-wrapper">
          <button className="product-carousel-btn prev" onClick={scrollPrev}>
            <ChevronLeft size={24} />
          </button>

          <div className="product-embla" ref={emblaRef}>
            <div className="product-embla__container">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="product-embla__slide">
                    <SkeletonCard />
                  </div>
                ))
              ) : featuredProducts.map((product) => (
                <div key={product.id} className="product-embla__slide">
                  <Link to={`/egitim-seti/${product.id}`} className="atolye-card-link">
                    <article className="atolye-card">
                      <div className="atolye-card__image-wrap">
                        <img src={product.images[0]} alt={product.title} className="atolye-card__image" />
                        <div className="atolye-card__image-overlay" />
                      </div>
                      <div className="atolye-card__body">
                        <span className="atolye-card__badge">Eğitim Seti</span>
                        <h3 className="atolye-card__title">{product.title}</h3>
                        <p className="atolye-card__desc">
                          {product.description
                            ? product.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...'
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
                </div>
              ))}
            </div>
          </div>

          <button className="product-carousel-btn next" onClick={scrollNext}>
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Video 2: Yenilikçi Eğitim Modelleri */}
      <section className="video-highlight secondary-video container">
        <VideoSection 
          url="https://www.youtube.com/watch?v=UkpCA2NMpvU"
          title="YENİLİKÇİ EĞİTİM MODELLERİ"
          description="Geleceğin havacılarını modern ve dinamik eğitim setlerimizle hazırlıyoruz. Teorik bilgiyi pratik uygulama ile birleştiren sistemlerimizle tanışın. Sivil havacılık standartlarında teknik beceri gelişimi sağlıyoruz."
          reverse={true}
        />
      </section>

      <section className="cta-section container">
        <div className="cta-content">
          <h2>Havacılık Akademiniz İçin Özel Çözümler</h2>
          <p>
            Havacılıkta standartlara bağlı kalmayın, okulunuza özel laboratuvar projelerini birlikte tasarlayalım. 
            İhtiyacınız olan her türlü eğitim donanımını, fikir aşamasından anahtar teslim üretime kadar hayata geçiriyoruz.
          </p>
          <a href="/iletisim" className="btn-cta">BİZİMLE İLETİŞİME GEÇİN</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
