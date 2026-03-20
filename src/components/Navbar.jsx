import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sayfa değişince mobil menüyü kapat
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const isEgitimActive =
    location.pathname.startsWith('/egitim-seti') ||
    location.pathname === '/atolye-egitim-setleri' ||
    location.pathname === '/ata-chapter-egitim-setleri';

  const isDarkHero = location.pathname === '/havacilik-cozumleri';

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'menu-open' : ''} ${isDarkHero && !scrolled ? 'dark-hero' : ''}`}>
        <div className="navbar-container container">

          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/">
              <img src="/newlogo01.png" alt="HAVEK Logo" className="logo-img" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="navbar-links">
            <Link
              to="/simulatorler"
              className={`nav-link ${location.pathname === '/simulatorler' ? 'active' : ''}`}
            >
              Simülatörler
            </Link>

            <div
              className={`nav-dropdown ${isEgitimActive ? 'active' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span className={`nav-link nav-link--dropdown ${isEgitimActive ? 'active' : ''}`}>
                Eğitim Setleri
                <svg className="dropdown-chevron" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                <Link to="/atolye-egitim-setleri" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Atölye Eğitim Setleri
                </Link>
                <Link to="/ata-chapter-egitim-setleri" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  ATA Chapter Bazlı Eğitim Setleri
                </Link>
              </div>
            </div>

            <Link
              to="/havacilik-cozumleri"
              className={`nav-link ${location.pathname === '/havacilik-cozumleri' ? 'active' : ''}`}
            >
              Havacılık Çözümleri
            </Link>

            <Link
              to="/online-katalog"
              className={`nav-link ${location.pathname === '/online-katalog' ? 'active' : ''}`}
            >
              Online Katalog
            </Link>
          </nav>

          <div className="navbar-right">
            <Link to="/iletisim" className="btn-contact">Bize Ulaşın</Link>

            {/* Hamburger */}
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

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/simulatorler" className="mobile-link">Simülatörler</Link>
          <div className="mobile-group">
            <span className="mobile-group__label">Eğitim Setleri</span>
            <Link to="/atolye-egitim-setleri" className="mobile-link mobile-link--sub">Atölye Eğitim Setleri</Link>
            <Link to="/ata-chapter-egitim-setleri" className="mobile-link mobile-link--sub">ATA Chapter Bazlı</Link>
          </div>
          <Link to="/havacilik-cozumleri" className="mobile-link">Havacılık Çözümleri</Link>
          <Link to="/online-katalog" className="mobile-link">Online Katalog</Link>
          <Link to="/iletisim" className="mobile-cta">Bize Ulaşın</Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
