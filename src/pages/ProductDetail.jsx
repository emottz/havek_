
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Layout, Camera, AlertCircle, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pdf } from '@react-pdf/renderer';
import { useProduct } from '../hooks/useProducts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SkeletonProductDetail } from '../components/Skeleton';
import { TechnicalSheet } from '../components/TechnicalSheet';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const email = settings.email || 'info@havek.com.tr';
  const [activeIndex, setActiveIndex] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false); // false | 'tr' | 'en'

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

  const handleDownloadPdf = async (lang = 'tr') => {
    setPdfLoading(lang);
    try {
      const rawImages = (product.images || []).filter(Boolean).slice(0, 3);
      const [resolvedImages, logoDataUrl] = await Promise.all([
        Promise.all(rawImages.map(fetchImageAsDataUrl)).then(r => r.filter(Boolean)),
        fetchImageAsDataUrl('/Beyaz_logo.png'),
      ]);
      const blob = await pdf(
        <TechnicalSheet product={product} lang={lang} resolvedImages={resolvedImages} email={email} logoDataUrl={logoDataUrl} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HAVEK_${product.id}_${lang === 'en' ? 'technical-document' : 'teknik-dokuman'}.pdf`;
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
        <h2>Ürün Bulunamadı</h2>
        <p>Aradığınız eğitim seti sistemimizde kayıtlı değildir veya taşınmış olabilir.</p>
        <Link to="/egitim-setleri" className="btn-back">
          <ArrowLeft size={20} /> EĞİTİM SETLERİNE DÖN
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/egitim-setleri">Eğitim Setleri</Link>
          <span className="separator">/</span>
          <span className="current">{product.title}</span>
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
                      alt={product.title} 
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
                                <img src={img} alt={`${product.title} - ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                )}
              </div>
            ) : (
              <div className="no-image-placeholder">
                <Camera size={64} />
                <p>Görüntülenecek resim bulunmuyor.</p>
              </div>
            )}
          </div>

          <div className="product-info glass-card">
            <h1 className="product-title">{product.title}</h1>
            <div className="title-underline"></div>
            
            <div className="product-meta">
              <div className="meta-item">
                <Package size={20} />
                <span>Kategori: Havacılık Eğitim Seti</span>
              </div>
              <div className="meta-item">
                <Layout size={20} />
                <span>Modüler Tasarım</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Ürün Açıklaması</h3>
              {product.description
                ? <div className="product-desc-body" dangerouslySetInnerHTML={{ __html: product.description }} />
                : <p>Bu ürün için henüz detaylı bir açıklama girilmemiştir. Lütfen katalog üzerinden detayları inceleyiniz.</p>
              }
            </div>

            <div className="product-actions">
              <a href={`/iletisim?urun=${encodeURIComponent(product.title)}`} className="btn-cta">TEKLİF ALIN</a>
              <button
                className="btn-secondary btn-pdf"
                onClick={() => handleDownloadPdf('tr')}
                disabled={!!pdfLoading}
              >
                <FileDown size={16} />
                {pdfLoading === 'tr' ? 'Hazırlanıyor...' : 'TEKNİK DÖKÜMAN (TR)'}
              </button>
              <button
                className="btn-secondary btn-pdf"
                onClick={() => handleDownloadPdf('en')}
                disabled={!!pdfLoading}
              >
                <FileDown size={16} />
                {pdfLoading === 'en' ? 'Preparing...' : 'TECHNICAL DOCUMENT (EN)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
