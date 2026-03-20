import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('visible');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fadeout'), 3600);
    const t2 = setTimeout(() => onComplete(), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={`preloader ${phase === 'fadeout' ? 'preloader--out' : ''}`}>
      <div className="preloader__logo-container">
        <svg
          className="preloader__svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
        >
          <path className="preloader__path preloader__path--1" pathLength="100"
            d="M211.89,507.63h-78.46v72.06h-36.27v-169.72h36.27v61.39h78.46v-60.92h36.51v169.25h-36.51v-72.06Z"/>
          <path className="preloader__path preloader__path--2" pathLength="100"
            d="M443.26,565.37l-66.22-148.01c-1.7-3.78-5.45-6.2-9.59-6.2h-23.88c-4.12,0-7.85,2.4-9.57,6.16l-67.24,147.99c-3.15,6.95,1.93,14.85,9.57,14.85h2.63c23.9,0,46.77-9.73,63.33-26.96l3.75-3.9v-82.5l9.44-10.19,10.36,10.19v30.21l40.6,28.02v11.8l-19.15-1.88-20.68,1.52-.19,12.44,1.86,2.07c16.67,18.57,40.44,29.17,65.39,29.17h0c7.62,0,12.7-7.85,9.59-14.78ZM336.41,536.28l-15.11-1.88-17.74,1.88v-11.33l33.24-21.71-.39,33.04Z"/>
          <path className="preloader__path preloader__path--3" pathLength="100"
            d="M535.22,580.16h-41.96l-54.99-169.25h38.4l37.69,118.99h.47l38.16-118.99h38.4l-56.18,169.25Z"/>
          <path className="preloader__path preloader__path--4" pathLength="100"
            d="M637.62,512.6v36.03h95.53v31.29h-131.56v-169.72h123.5v31.29h-87.47v38.16h77.28v32.95h-77.28Z"/>
          <path className="preloader__path preloader__path--5" pathLength="100"
            d="M908.56,580.16h-51.2l-44.09-47.41-22.05,30.58v16.83h-37.93v-169.48h37.93v96l66.13-96h46.22l-63.76,96,68.74,73.48Z"/>
        </svg>
      </div>
    </div>
  );
};

export default Preloader;
