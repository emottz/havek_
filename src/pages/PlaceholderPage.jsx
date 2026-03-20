import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '4rem', borderRadius: '16px' }}>
        <h1 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', fontSize: '2.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
          Bu sayfa yapım aşamasındadır. Çok yakında yeni içeriklerle karşınızda olacağız!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
