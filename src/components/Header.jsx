import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFilters } from '../context/FilterContext'
import './Header.css'

export default function Header({ onCartToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { getTotalItems } = useCart()
  const { filters, updateFilter, categories } = useFilters()

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
    setFilterMenuOpen(false)
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

        {/* Right side: Filter, Language selector, admin, cart */}
        <div className="header-actions">
          {/* Filter Button (Funil) */}
          <div className="filter-dropdown">
            <button 
              className="filter-btn"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              title="Filtros"
              aria-label="Abrir filtros"
            >
              <span className="filter-icon">⚙️</span>
            </button>
            
            {/* Filter Dropdown Menu */}
            {filterMenuOpen && (
              <div className="filter-menu">
                <div className="filter-menu-title">Categorias</div>
                <div className="filter-menu-item">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={filters.category === 'all'}
                      onChange={(e) => handleCategoryClick(e.target.value)}
                    />
                    Todos os Produtos
                  </label>
                </div>
                {Object.entries(categoryMap).map(([key, name]) => (
                  <div key={key} className="filter-menu-item">
                    <label>
                      <input
                        type="radio"
                        name="category"
                        value={key}
                        checked={filters.category === key}
                        onChange={(e) => handleCategoryClick(e.target.value)}
                      />
                      {name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

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
      
      {/* Fechar menu de filtros ao clicar fora */}
      {filterMenuOpen && (
        <div 
          className="filter-overlay"
          onClick={() => setFilterMenuOpen(false)}
        />
      )}
    </header>
  )
}
