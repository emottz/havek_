import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPlatform } from '../lib/socialPlatforms';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

const SocialIcon = ({ platform }) => (
  <span dangerouslySetInnerHTML={{ __html: getPlatform(platform).icon }} />
);

const Contact = () => {
  const [searchParams] = useSearchParams();
  const urunParam = searchParams.get('urun') || '';
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '', product: urunParam, message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const { settings } = useSiteSettings();
  const { phone, email, address, map_query, socials = [], web3forms_key } = settings;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
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

      if (dbError) throw new Error(t('contact.err.db'));

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
          // Email gönderilemese bile devam et
        }
      }

      setStatus('success');
      setForm({ name: '', company: '', phone: '', email: '', product: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || t('contact.err.generic'));
    }
  };

  const mapSrc = map_query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(map_query)}&output=embed&hl=tr&z=15`
    : null;

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <p className="contact-hero__label">{t('contact.hero.label')}</p>
          <h1 className="contact-hero__title">{t('contact.hero.title')}</h1>
          <p className="contact-hero__desc">{t('contact.hero.desc')}</p>
        </div>
      </div>

      <section className="contact-section container">
        <div className="contact-grid">

          <div className="contact-info-card">
            <h2>{t('contact.info.title')}</h2>
            <p className="contact-info-desc">{t('contact.info.desc')}</p>

            <div className="contact-items">
              {phone && (
                <div className="contact-item">
                  <div className="contact-item__icon"><Phone size={20} /></div>
                  <div>
                    <span className="contact-item__label">{t('contact.phone')}</span>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-item__value">{phone}</a>
                  </div>
                </div>
              )}
              {email && (
                <div className="contact-item">
                  <div className="contact-item__icon"><Mail size={20} /></div>
                  <div>
                    <span className="contact-item__label">{t('contact.email')}</span>
                    <a href={`mailto:${email}`} className="contact-item__value">{email}</a>
                  </div>
                </div>
              )}
              {address && (
                <div className="contact-item">
                  <div className="contact-item__icon"><MapPin size={20} /></div>
                  <div>
                    <span className="contact-item__label">{t('contact.address')}</span>
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
              <span className="contact-badge">{t('contact.badge.compliance')}</span>
              <span className="contact-badge">Part 145</span>
              <span className="contact-badge">Part 147</span>
            </div>
          </div>

          <div className="contact-form-card">
            <h2>{t('contact.form.title')}</h2>

            {status === 'success' ? (
              <div className="form-success">
                <CheckCircle size={48} />
                <h3>{t('contact.success.title')}</h3>
                <p>{t('contact.success.desc')}</p>
                <button className="btn-submit" onClick={() => setStatus('idle')}>{t('contact.success.btn')}</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('contact.form.name')}</label>
                  <input name="name" type="text" placeholder={t('contact.form.namePh')} required
                    value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>{t('contact.form.company')}</label>
                  <input name="company" type="text" placeholder={t('contact.form.companyPh')}
                    value={form.company} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.form.phone')}</label>
                    <input name="phone" type="tel" placeholder="+90 5XX XXX XX XX"
                      value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.form.email')}</label>
                    <input name="email" type="email" placeholder="ornek@email.com" required
                      value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('contact.form.product')}</label>
                  <input name="product" type="text" placeholder={t('contact.form.productPh')}
                    value={form.product} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>{t('contact.form.message')}</label>
                  <textarea name="message" rows={4} placeholder={t('contact.form.messagePh')}
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
                    ? <><Loader size={16} className="spin" /> {t('contact.form.sending')}</>
                    : t('contact.form.submit')}
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
                {t('contact.map.open')}
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
