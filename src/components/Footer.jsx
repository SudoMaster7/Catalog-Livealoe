import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>{t('common:brand')}</h3>
          <ul>
            <li><a href="#about">{t('common:about_us')}</a></li>
            <li><a href="#sustainability">{t('common:sustainability')}</a></li>
            <li><a href="#certifications">{t('common:certifications')}</a></li>
            <li><a href="#contact">{t('common:contact')}</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>{t('common:contact')}</h3>
          <p>Email: <a href="mailto:contato@livealoe.com.br">{t('common:contact_email')}</a></p>
          <p>Website: <a href="https://www.livealoe.com.br" target="_blank" rel="noopener noreferrer">{t('common:website')}</a></p>
        </div>

        <div className="footer-section certifications">
          <h3>{t('common:certifications')}</h3>
          <div className="certs-grid">
            <div className="cert-badge">🌱 Orgânico Certificado</div>
            <div className="cert-badge">✓ IBD</div>
            <div className="cert-badge">♻️ Eureciclo</div>
          </div>
        </div>

        <div className="footer-section">
          <h3>{t('common:follow_us')}</h3>
          <div className="social-links">
            <a href="#instagram" title="Instagram">📷</a>
            <a href="#facebook" title="Facebook">👍</a>
            <a href="#tiktok" title="TikTok">🎵</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-note">{t('common:footer_note')}</div>
        <div className="footer-links">
          <a href="#privacy">{t('common:privacy')}</a> | <a href="#terms">{t('common:terms')}</a>
        </div>
      </div>
    </footer>
  )
}
