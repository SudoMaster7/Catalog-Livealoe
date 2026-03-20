import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

export default function Header({ onCartToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { getTotalItems } = useCart()

  const languages = [
    { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <h1>{t('common:brand')}</h1>
        </div>

        {/* Right side: Language selector, admin, cart */}
        <div className="header-actions">
          {/* Language Selector */
          <div className="language-selector">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => i18n.changeLanguage(lang.code)}
                title={lang.label}
              >
                {lang.flag}
              </button>
            ))}
          </div>

          {/* Admin Link */}
          <Link to="/admin" className="admin-link" title="Painel Admin">
            ⚙️
          </Link>

          {/* Cart Icon */}
          <button className="cart-btn" onClick={onCartToggle}>
            <span className="cart-icon">🛒</span>
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
