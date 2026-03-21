import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Simulators from './pages/Simulators';
import TrainingSets from './pages/TrainingSets';
import ProductDetail from './pages/ProductDetail';
import OnlineKatalog from './pages/OnlineKatalog';
import AtolyeEgitimSetleri from './pages/AtolyeEgitimSetleri';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import HavacılikCozumleri from './pages/HavacılikCozumleri';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMessages from './pages/admin/AdminMessages';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const SiteLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return <>{children}</>;
  return (
    <div className="app-layout">
      <div className="bg-decor top-left"></div>
      <div className="bg-decor bottom-right"></div>
      <Navbar />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <BrowserRouter>
      <LanguageProvider>
      {!isAdmin && !preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulatorler" element={<Simulators />} />
          <Route path="/atolye-egitim-setleri" element={<AtolyeEgitimSetleri />} />
          <Route path="/ata-chapter-egitim-setleri" element={<TrainingSets />} />
          <Route path="/egitim-seti/:id" element={<ProductDetail />} />
          <Route path="/havacilik-cozumleri" element={<HavacılikCozumleri />} />
          <Route path="/online-katalog" element={<OnlineKatalog />} />
          <Route path="/iletisim" element={<Contact />} />
          {/* Admin — kendi layout'u var, Navbar/Footer yok */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/urunler" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/urun/yeni" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          <Route path="/admin/urun/:id/duzenle" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          <Route path="/admin/ayarlar" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/mesajlar" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
