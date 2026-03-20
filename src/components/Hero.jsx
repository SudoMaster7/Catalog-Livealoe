import { useTranslation } from 'react-i18next'
import './Hero.css'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop"
        alt="Aloe vera cultivation"
        className="hero-image"
      />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-headline">{t('common:headline')}</h2>
        <p className="hero-tagline">{t('common:tagline')}</p>
        <button className="hero-cta">
          ✨ {t('ui:search_placeholder')}
        </button>
      </div>
    </section>
  )
}
