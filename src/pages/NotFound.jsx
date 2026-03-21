import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="notfound-page">
      <div className="notfound-inner">
        <div className="notfound-code">404</div>
        <div className="notfound-divider" />
        <h1 className="notfound-title">{t('notfound.title')}</h1>
        <p className="notfound-desc">{t('notfound.desc')}</p>
        <div className="notfound-actions">
          <button className="notfound-btn-back" onClick={() => navigate(-1)}>
            {t('notfound.back')}
          </button>
          <Link to="/" className="notfound-btn-home">
            {t('notfound.home')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
