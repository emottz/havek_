import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPlatform } from '../lib/socialPlatforms';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const SocialIcon = ({ platform }) => (
  <span dangerouslySetInnerHTML={{ __html: getPlatform(platform).icon }} />
);

const Footer = () => {
  const { settings } = useSiteSettings();
  const { phone, email, address, map_query, socials = [] } = settings;
  const { t } = useLanguage();

  const mapSrc = map_query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(map_query)}&output=embed&hl=tr&z=15`
    : null;

  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <img src="/newlogo01.png" alt="HAVEK Logo" className="footer-logo" />
          <p className="footer-description">{t('footer.desc')}</p>
          {socials.length > 0 && (
            <div className="footer-socials">
              {socials.map(s => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link"
                  aria-label={s.label || s.platform}
                  title={s.label || getPlatform(s.platform).label}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer-links">
          <h4>{t('footer.links')}</h4>
          <ul>
            <li><a href="/simulatorler">{t('footer.link.simulators')}</a></li>
            <li><a href="/atolye-egitim-setleri">{t('footer.link.workshop')}</a></li>
            <li><a href="/ata-chapter-egitim-setleri">{t('footer.link.ata')}</a></li>
            <li><a href="/havacilik-cozumleri">{t('footer.link.solutions')}</a></li>
            <li><a href="/online-katalog">{t('footer.link.catalog')}</a></li>
            <li><a href="/iletisim">{t('footer.link.contact')}</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>{t('footer.contact')}</h4>
          <ul className="footer-contact-list">
            {address && (
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{address}</span>
              </li>
            )}
            {phone && (
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </li>
            )}
            {email && (
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
          </ul>
        </div>

      </div>

      {mapSrc && (
        <div className="footer-map">
          <iframe
            title="HAVEK Konum"
            src={mapSrc}
            width="100%"
            height="220"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HAVEK | {t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
