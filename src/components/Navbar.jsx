import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const isEgitimActive =
    location.pathname.startsWith('/egitim-setleri') ||
    location.pathname === '/atolye-egitim-setleri' ||
    location.pathname === '/ata-chapter-egitim-setleri';

  const isDarkHero = location.pathname === '/havacilik-cozumleri';

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
            <div className="lang-toggle">
              <button
                className={`lang-btn ${lang === 'tr' ? 'active' : ''}`}
                onClick={() => setLang('tr')}
              >TR</button>
              <span className="lang-sep">|</span>
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >EN</button>
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
          <div className="mobile-lang-toggle">
            <button className={`lang-btn ${lang === 'tr' ? 'active' : ''}`} onClick={() => setLang('tr')}>TR</button>
            <span className="lang-sep">|</span>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
          <Link to="/iletisim" className="mobile-cta">{t('nav.contact')}</Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
