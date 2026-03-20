import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPlatform } from '../lib/socialPlatforms';
import { supabase } from '../lib/supabase';
import './Contact.css';

const SocialIcon = ({ platform }) => (
  <span dangerouslySetInnerHTML={{ __html: getPlatform(platform).icon }} />
);

const Contact = () => {
  const [searchParams] = useSearchParams();
  const urunParam = searchParams.get('urun') || '';

  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '', product: urunParam, message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const { settings } = useSiteSettings();
  const { phone, email, address, map_query, socials = [], web3forms_key } = settings;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      // Her zaman Supabase'e kaydet
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          product: form.product,
          message: form.message,
        });

      if (dbError) throw new Error('Mesaj kaydedilemedi. Lütfen tekrar deneyin.');

      // Web3Forms ile de email göndermeyi dene (başarısız olsa bile form gönderildi sayılır)
      if (web3forms_key) {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: web3forms_key,
              subject: `Teklif Talebi: ${form.product || 'Genel'} — ${form.name}`,
              from_name: 'HAVEK İletişim Formu',
              ...form,
            }),
          });
        } catch {
          // Email gönderilemese bile devam et, DB'ye kaydedildi
        }
      }

      setStatus('success');
      setForm({ name: '', company: '', phone: '', email: '', product: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const mapSrc = map_query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(map_query)}&output=embed&hl=tr&z=15`
    : null;

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <p className="contact-hero__label">İletişim</p>
          <h1 className="contact-hero__title">Bizimle İletişime Geçin</h1>
          <p className="contact-hero__desc">
            Eğitim setleri, simülatörler ve özel projeler için teklif almak ya da daha fazla bilgi edinmek için bize ulaşın.
          </p>
        </div>
      </div>

      <section className="contact-section container">
        <div className="contact-grid">

          <div className="contact-info-card">
            <h2>İletişim Bilgileri</h2>
            <p className="contact-info-desc">
              HAVEK olarak havacılık eğitim ekipmanları konusunda uzman ekibimizle size en uygun çözümü sunmak için hazırız.
            </p>

            <div className="contact-items">
              {phone && (
                <div className="contact-item">
                  <div className="contact-item__icon"><Phone size={20} /></div>
                  <div>
                    <span className="contact-item__label">Telefon</span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-item__value">{phone}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="contact-item">
                  <div className="contact-item__icon"><Mail size={20} /></div>
                  <div>
                    <span className="contact-item__label">E-posta</span>
                    <a href={`mailto:${email}`} className="contact-item__value">{email}</a>
                  </div>
                </div>
              )}
              {address && (
                <div className="contact-item">
                  <div className="contact-item__icon"><MapPin size={20} /></div>
                  <div>
                    <span className="contact-item__label">Adres</span>
                    <a
                      href={map_query ? `https://maps.google.com/?q=${encodeURIComponent(map_query)}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-item__value"
                    >
                      {address}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {socials.length > 0 && (
              <div className="contact-socials">
                {socials.map(s => {
                  const platform = getPlatform(s.platform);
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-social-btn"
                      style={{ '--social-color': platform.color }}
                    >
                      <SocialIcon platform={s.platform} />
                      {s.label || platform.label}
                    </a>
                  );
                })}
              </div>
            )}

            <div className="contact-badges">
              <span className="contact-badge">EASA Uyumlu</span>
              <span className="contact-badge">FAA Uyumlu</span>
              <span className="contact-badge">Part 145</span>
              <span className="contact-badge">Part 147</span>
            </div>
          </div>

          <div className="contact-form-card">
            <h2>Teklif Talebi</h2>

            {status === 'success' ? (
              <div className="form-success">
                <CheckCircle size={48} />
                <h3>Mesajınız İletildi!</h3>
                <p>En kısa sürede size geri dönüş yapacağız.</p>
                <button className="btn-submit" onClick={() => setStatus('idle')}>Yeni Mesaj Gönder</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Ad Soyad</label>
                  <input name="name" type="text" placeholder="Adınız Soyadınız" required
                    value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Kurum / Şirket</label>
                  <input name="company" type="text" placeholder="Kurum veya şirket adı"
                    value={form.company} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefon</label>
                    <input name="phone" type="tel" placeholder="+90 5XX XXX XX XX"
                      value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>E-posta</label>
                    <input name="email" type="email" placeholder="ornek@email.com" required
                      value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>İlgilendiğiniz Ürün / Konu</label>
                  <input name="product" type="text" placeholder="Ürün adı veya konu"
                    value={form.product} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Mesajınız</label>
                  <textarea name="message" rows={4} placeholder="Detaylı açıklama veya talepleriniz..."
                    value={form.message} onChange={handleChange} />
                </div>
                {status === 'error' && (
                  <div className="form-error-msg">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                  {status === 'sending'
                    ? <><Loader size={16} className="spin" /> Gönderiliyor...</>
                    : 'TALEP GÖNDER'}
                </button>
              </form>
            )}
          </div>

        </div>

        {mapSrc && (
          <div className="contact-map">
            <div className="contact-map__header">
              <MapPin size={18} />
              <span>{address}</span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(map_query)}`}
                target="_blank"
                rel="noreferrer"
                className="contact-map__link"
              >
                Google Maps'te Aç ↗
              </a>
            </div>
            <iframe
              title="HAVEK Konum"
              src={mapSrc}
              width="100%"
              height="380"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Contact;
