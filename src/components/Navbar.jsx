import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const LANGS = [
  { code: 'tr', label: 'Türkçe',  flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isEgitimActive =
    location.pathname.startsWith('/egitim-setleri') ||
    location.pathname === '/atolye-egitim-setleri' ||
    location.pathname === '/ata-chapter-egitim-setleri';

  const isDarkHero = location.pathname === '/havacilik-cozumleri';
  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'menu-open' : ''} ${isDarkHero && !scrolled ? 'dark-hero' : ''}`}>
        <div className="navbar-container container">

          <div className="navbar-logo">
            <Link to="/">
              <img src="/newlogo01.png" alt="HAVEK Logo" className="logo-img" />
            </Link>
          </div>

          <nav className="navbar-links">
            <Link
              to="/simulatorler"
              className={`nav-link ${location.pathname === '/simulatorler' ? 'active' : ''}`}
            >
              {t('nav.simulator')}
            </Link>

            <div
              className={`nav-dropdown ${isEgitimActive ? 'active' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span className={`nav-link nav-link--dropdown ${isEgitimActive ? 'active' : ''}`}>
                {t('nav.training')}
                <svg className="dropdown-chevron" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                <Link to="/atolye-egitim-setleri" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  {t('nav.trainingDropdown.workshop')}
                </Link>
                <Link to="/ata-chapter-egitim-setleri" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  {t('nav.trainingDropdown.ata')}
                </Link>
              </div>
            </div>

            <Link
              to="/havacilik-cozumleri"
              className={`nav-link ${location.pathname === '/havacilik-cozumleri' ? 'active' : ''}`}
            >
              {t('nav.solutions')}
            </Link>

            <Link
              to="/online-katalog"
              className={`nav-link ${location.pathname === '/online-katalog' ? 'active' : ''}`}
            >
              {t('nav.catalog')}
            </Link>
          </nav>

          <div className="navbar-right">
            {/* Language Dropdown */}
            <div className="lang-dropdown" ref={langRef}>
              <button
                className="lang-dropdown__trigger"
                onClick={() => setLangOpen(o => !o)}
                aria-label="Dil seç"
              >
                <span className="lang-dropdown__flag">{currentLang.flag}</span>
                <span className="lang-dropdown__code">{currentLang.code.toUpperCase()}</span>
                <svg className={`lang-dropdown__chevron ${langOpen ? 'open' : ''}`} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown__menu">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={`lang-dropdown__item ${lang === l.code ? 'active' : ''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      <span className="lang-dropdown__item-flag">{l.flag}</span>
                      <span className="lang-dropdown__item-label">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/iletisim" className="btn-contact">{t('nav.contact')}</Link>
            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menü"
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/simulatorler" className="mobile-link">{t('nav.simulator')}</Link>
          <div className="mobile-group">
            <span className="mobile-group__label">{t('nav.training')}</span>
            <Link to="/atolye-egitim-setleri" className="mobile-link mobile-link--sub">{t('nav.trainingDropdown.workshop')}</Link>
            <Link to="/ata-chapter-egitim-setleri" className="mobile-link mobile-link--sub">{t('nav.trainingDropdown.ata')}</Link>
          </div>
          <Link to="/havacilik-cozumleri" className="mobile-link">{t('nav.solutions')}</Link>
          <Link to="/online-katalog" className="mobile-link">{t('nav.catalog')}</Link>
          <div className="mobile-lang-grid">
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`mobile-lang-item ${lang === l.code ? 'active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <Link to="/iletisim" className="mobile-cta">{t('nav.contact')}</Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
