import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilters } from '../context/FilterContext'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Sidebar from '../components/Sidebar'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import ScrollToTop from '../components/ScrollToTop'
import './Catalog.css'

export default function Catalog() {
  const { t } = useTranslation()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const { products, filters, updateFilter } = useFilters()

  const categoryMap = {
    'multifuncionais': 'Multifuncionais',
    'face': 'Rosto',
    'body': 'Corpo',
    'mouth': 'Boca',
    'hair': 'Cabelo'
  }

  const handleCategoryClick = (category) => {
    updateFilter('category', category)
    setFilterMenuOpen(false)
  }

  return (
    <div className="catalog-page">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      <Hero />

      <div className="catalog-container">
        <Sidebar />

        <main className="catalog-main">
          <div className="search-filter-section">
            <SearchBar />
            
            {/* Filter Button */}
            <div className="filter-dropdown">
              <button 
                className="filter-btn"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                title="Filtros"
                aria-label="Abrir filtros"
              >
                <span className="filter-icon">⧂</span>
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
          </div>

          {filterMenuOpen && (
            <div 
              className="filter-overlay"
              onClick={() => setFilterMenuOpen(false)}
            />
          )}

          <div className="results-info">
            <span className="results-count">
              {products.length} {products.length === 1 ? t('ui:products_found') : t('ui:products_found_plural')}
            </span>
          </div>

          <ProductGrid />
        </main>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ScrollToTop />
      <Footer />
    </div>
  )
}
