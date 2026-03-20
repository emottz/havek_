import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <div className="notfound-divider" />
        <h1 className="notfound-title">Sayfa Bulunamadı</h1>
        <p className="notfound-desc">
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>
        <div className="notfound-actions">
          <button className="notfound-btn-back" onClick={() => navigate(-1)}>
            ← Geri Dön
          </button>
          <Link to="/" className="notfound-btn-home">
            Ana Sayfaya Git
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
