
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Layout, Camera, AlertCircle, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pdf } from '@react-pdf/renderer';
import { useProduct } from '../hooks/useProducts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SkeletonProductDetail } from '../components/Skeleton';
import { TechnicalSheet } from '../components/TechnicalSheet';
import { useLanguage } from '../context/LanguageContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const email = settings.email || 'info@havek.com.tr';
  const { lang, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

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
      const rawImages = (product.images || []).filter(Boolean).slice(0, 3);
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
        <Link to="/egitim-setleri" className="btn-back">
          <ArrowLeft size={20} /> {t('pd.notFound.back')}
        </Link>
      </div>
    );
  }

  const displayTitle = (lang !== 'tr' && product[`title_${lang}`]) ? product[`title_${lang}`] : product.title;
  const displayDesc = (lang !== 'tr' && product[`description_${lang}`]) ? product[`description_${lang}`] : product.description;

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/egitim-setleri">{t('pd.breadcrumb')}</Link>
          <span className="separator">/</span>
          <span className="current">{displayTitle}</span>
        </nav>

        <div className="product-layout">
          <div className="product-gallery glass-card">
            {product.images && product.images.length > 0 ? (
              <div className="gallery-main">
                <div className="main-image-container">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeIndex}
                      src={product.images[activeIndex]}
                      alt={displayTitle}
                      className="active-main-image"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
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
                                <img src={img} alt={`${displayTitle} - ${idx + 1}`} />
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
              {product.title_ja && (
                <button
                  className="btn-secondary btn-pdf"
                  onClick={() => handleDownloadPdf('ja')}
                  disabled={!!pdfLoading}
                >
                  <FileDown size={16} />
                  {pdfLoading === 'ja' ? t('pd.preparing') : t('pd.pdfJA')}
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
