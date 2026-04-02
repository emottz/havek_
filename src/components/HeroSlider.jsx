import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import './HeroSlider.css'

const DELAY = 5500
const EASE = [0.16, 1, 0.3, 1]

const textVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.11 },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } },
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const intervalRef = useRef(null)
  const touchX = useRef(null)
  const { t } = useLanguage()

  const SLIDES = [
    {
      id: 1,
      eyebrow: t('hero.slide1.eyebrow'),
      title: t('hero.slide1.title'),
      desc: t('hero.slide1.desc'),
      img: '/01.webp',
      imgFallback: '/01.png',
      mobileImg: '/20.webp',
      mobileImgFallback: '/20.png',
      cta: t('hero.slide1.cta'),
      href: '/egitim-setleri',
    },
    {
      id: 2,
      eyebrow: t('hero.slide2.eyebrow'),
      title: t('hero.slide2.title'),
      desc: t('hero.slide2.desc'),
      img: '/slidesimülatoryeni.webp',
      imgFallback: '/slidesimülatoryeni.png',
      mobileImg: '/slidesimülatoryeni.webp',
      mobileImgFallback: '/slidesimülatoryeni.png',
      cta: t('hero.slide2.cta'),
      href: '/simulatorler',
    },
    {
      id: 3,
      eyebrow: t('hero.slide3.eyebrow'),
      title: t('hero.slide3.title'),
      desc: t('hero.slide3.desc'),
      img: '/03.webp',
      imgFallback: '/03.png',
      mobileImg: '/22.webp',
      mobileImgFallback: '/22.png',
      cta: t('hero.slide3.cta'),
      href: '/ata-chapter-egitim-setleri',
    },
  ]

  const goTo = useCallback((next) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length)
    setProgressKey((k) => k + 1)
  }, [SLIDES.length])

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setIndex((i) => {
      setProgressKey((k) => k + 1)
      return (i + 1) % SLIDES.length
    }), DELAY)
  }, [SLIDES.length])

  useEffect(() => {
    resetInterval()
    return () => clearInterval(intervalRef.current)
  }, [resetInterval])

  const prev = () => { goTo(index - 1); resetInterval() }
  const next = () => { goTo(index + 1); resetInterval() }

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 48) { dx > 0 ? next() : prev() }
    touchX.current = null
  }

  const slide = SLIDES[index]
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div
      className="hs"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((s, i) => (
        <div key={s.id} className={`hs__bg${i === index ? ' hs__bg--active' : ''}`}>
          <picture>
            <source media="(max-width: 768px)" srcSet={s.mobileImg} type="image/webp" />
            <source media="(max-width: 768px)" srcSet={s.mobileImgFallback} />
            <source srcSet={s.img} type="image/webp" />
            <img src={s.imgFallback} alt="" aria-hidden="true" className="hs__bg-img" />
          </picture>
        </div>
      ))}

      <div className="hs__overlay" />

      <div className="hs__content">
        <AnimatePresence mode="wait">
          <motion.div key={index} className="hs__text">
            <motion.span
              className="hs__eyebrow"
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {slide.eyebrow}
            </motion.span>

            <motion.h1
              className="hs__title"
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="hs__title-line">{line}</span>
              ))}
            </motion.h1>

            <motion.p
              className="hs__desc"
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {slide.desc}
            </motion.p>

            <motion.a
              href={slide.href}
              className="hs__cta"
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {slide.cta}
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hs__nav">
        <span className="hs__counter">
          <strong>{pad(index + 1)}</strong>
          <span className="hs__counter-sep" />
          {pad(SLIDES.length)}
        </span>

        <div className="hs__progress" role="progressbar">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`hs__track${i === index ? ' hs__track--active' : ''}`}
              onClick={() => { goTo(i); resetInterval() }}
              aria-label={`Slide ${i + 1}`}
            >
              {i === index && (
                <span
                  key={progressKey}
                  className="hs__fill"
                  style={{ animationDuration: `${DELAY}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="hs__arrows">
          <button className="hs__arrow" onClick={prev} aria-label="Önceki slayt">
            <ChevronLeft size={18} />
          </button>
          <button className="hs__arrow" onClick={next} aria-label="Sonraki slayt">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
