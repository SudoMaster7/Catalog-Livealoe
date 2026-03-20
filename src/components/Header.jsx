import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFilters } from '../context/FilterContext'
import './Header.css'

export default function Header({ onCartToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { getTotalItems } = useCart()
  const { filters, updateFilter } = useFilters()

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  // Mapear categorias com seus nomes em português
  const categoryMap = {
    'multifuncionais': 'Multifuncionais',
    'face': 'Rosto',
    'body': 'Corpo',
    'mouth': 'Boca',
    'hair': 'Cabelo'
  }

  // Função para tratar clique em categoria
  const handleCategoryClick = (category) => {
    updateFilter('category', category)
    setMobileMenuOpen(false)
  }

  // Função para renderizar links de categoria com classe ativa
  const renderCategoryLink = (categoryKey, displayName) => {
    const isActive = filters.category === categoryKey
    return (
      <li key={categoryKey}>
        <a 
          href={`#${categoryKey}`}
          className={`category-link ${isActive ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            handleCategoryClick(categoryKey)
          }}
          title={`Filtrar por ${displayName}`}
        >
          {displayName}
        </a>
      </li>
    )
  }

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

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            {Object.entries(categoryMap).map(([key, name]) => renderCategoryLink(key, name))}
          </ul>
        </nav>

        {/* Right side: Language selector, search, cart */}
        <div className="header-actions">
          {/* Language Selector */}
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
