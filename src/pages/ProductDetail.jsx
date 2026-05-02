
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, Layout, Camera, AlertCircle, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pdf } from '@react-pdf/renderer';
import { useProduct } from '../hooks/useProducts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SkeletonProductDetail } from '../components/Skeleton';
import { TechnicalSheet } from '../components/TechnicalSheet';
import { useLanguage } from '../context/LanguageContext';
import './ProductDetail.css';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || '/ata-chapter-egitim-setleri';
  const backLabel = location.state?.fromLabel;
  const { product, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const email = settings.email || 'info@havek.com.tr';
  const { lang, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const isVideoUrl = (url) => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

  const fetchImageAsDataUrl = async (src) => {
    const url = src.startsWith('/') ? `${window.location.origin}${src}` : src;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleDownloadPdf = async (pdfLang = 'tr') => {
    setPdfLoading(pdfLang);
    try {
      const rawImages = (product.images || []).filter(img => img && !isVideoUrl(img)).slice(0, 3);
      const [resolvedImages, logoDataUrl] = await Promise.all([
        Promise.all(rawImages.map(fetchImageAsDataUrl)).then(r => r.filter(Boolean)),
        fetchImageAsDataUrl('/Beyaz_logo.png'),
      ]);
      const blob = await pdf(
        <TechnicalSheet product={product} lang={pdfLang} resolvedImages={resolvedImages} email={email} logoDataUrl={logoDataUrl} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HAVEK_${product.id}_${pdfLang === 'en' ? 'technical-document' : 'teknik-dokuman'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveIndex(0);
  }, [id]);

  if (loading) {
    return <SkeletonProductDetail />;
  }

  if (error || !product) {
    return (
      <div className="product-not-found container">
        <AlertCircle size={64} color="#dc3545" />
        <h2>{t('pd.notFound.title')}</h2>
        <p>{t('pd.notFound.desc')}</p>
        <Link to={backTo} className="btn-back">
          <ArrowLeft size={20} /> {t('pd.notFound.back')}
        </Link>
      </div>
    );
  }

  const displayTitle = (lang !== 'tr' && product[`title_${lang}`]) ? product[`title_${lang}`] : product.title;
  const displayDesc = (lang !== 'tr' && product[`description_${lang}`]) ? product[`description_${lang}`] : product.description;

  const seoTitle = displayTitle ? `${displayTitle} — Havacılık Eğitim Seti` : 'Eğitim Seti Detayı';
  const seoDesc = displayDesc
    ? displayDesc.replace(/<[^>]+>/g, '').substring(0, 155)
    : 'HAVEK havacılık eğitim seti ürün detayı. EASA/FAA/SHGM uyumlu eğitim ekipmanları.';
  const seoImage = product.images?.find(img => !isVideoUrl(img)) ?? undefined;

  return (
    <div className="product-detail-page">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/egitim-seti/${id}`}
        image={seoImage}
        type="product"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": displayTitle,
          "description": seoDesc,
          "image": seoImage,
          "brand": { "@type": "Brand", "name": "HAVEK" },
          "offers": {
            "@type": "Offer",
            "url": `https://havek.tr/egitim-seti/${id}`,
            "priceCurrency": "TRY",
            "availability": "https://schema.org/InStock",
            "seller": { "@type": "Organization", "name": "HAVEK" }
          }
        }}
      />
      <div className="container">
        <nav className="breadcrumb">
          <Link to={backTo}>{backLabel || t('pd.breadcrumb')}</Link>
          <span className="separator">/</span>
          <span className="current">{displayTitle}</span>
        </nav>

        <div className="product-layout">
          <div className="product-gallery glass-card">
            {product.images && product.images.length > 0 ? (
              <div className="gallery-main">
                <div className="main-image-container">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      className="active-main-media"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isVideoUrl(product.images[activeIndex]) ? (
                        <video
                          src={product.images[activeIndex]}
                          controls
                          className="active-main-video"
                        />
                      ) : (
                        <img
                          src={product.images[activeIndex]}
                          alt={displayTitle}
                          className="active-main-image"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                {product.images.length > 1 && (
                    <div className="gallery-grid">
                        {product.images.map((img, idx) => (
                            <div
                              key={idx}
                              className={`gallery-item ${idx === activeIndex ? 'active' : ''}`}
                              onClick={() => setActiveIndex(idx)}
                            >
                                {isVideoUrl(img) ? (
                                  <div className="gallery-item__video-thumb">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                                      <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                  </div>
                                ) : (
                                  <img src={img} alt={`${displayTitle} - ${idx + 1}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
              </div>
            ) : (
              <div className="no-image-placeholder">
                <Camera size={64} />
                <p>{t('pd.noImage')}</p>
              </div>
            )}
          </div>

          <div className="product-info glass-card">
            <h1 className="product-title">{displayTitle}</h1>
            <div className="title-underline"></div>

            <div className="product-meta">
              <div className="meta-item">
                <Package size={20} />
                <span>{t('pd.category')}</span>
              </div>
              <div className="meta-item">
                <Layout size={20} />
                <span>{t('pd.modular')}</span>
              </div>
            </div>

            <div className="product-description">
              <h3>{t('pd.description')}</h3>
              {displayDesc
                ? <div className="product-desc-body" dangerouslySetInnerHTML={{ __html: displayDesc }} />
                : <p>{t('pd.noDesc')}</p>
              }
            </div>

            <div className="product-actions">
              <a href={`/iletisim?urun=${encodeURIComponent(product.title)}`} className="btn-cta">{t('pd.quote')}</a>
              <button
                className="btn-secondary btn-pdf"
                onClick={() => handleDownloadPdf('tr')}
                disabled={!!pdfLoading}
              >
                <FileDown size={16} />
                {pdfLoading === 'tr' ? t('pd.preparing') : t('pd.pdfTR')}
              </button>
              <button
                className="btn-secondary btn-pdf"
                onClick={() => handleDownloadPdf('en')}
                disabled={!!pdfLoading}
              >
                <FileDown size={16} />
                {pdfLoading === 'en' ? t('pd.preparing') : t('pd.pdfEN')}
              </button>
              {product.title_fr && (
                <button
                  className="btn-secondary btn-pdf"
                  onClick={() => handleDownloadPdf('fr')}
                  disabled={!!pdfLoading}
                >
                  <FileDown size={16} />
                  {pdfLoading === 'fr' ? t('pd.preparing') : t('pd.pdfFR')}
                </button>
              )}
              {product.title_de && (
                <button
                  className="btn-secondary btn-pdf"
                  onClick={() => handleDownloadPdf('de')}
                  disabled={!!pdfLoading}
                >
                  <FileDown size={16} />
                  {pdfLoading === 'de' ? t('pd.preparing') : t('pd.pdfDE')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
