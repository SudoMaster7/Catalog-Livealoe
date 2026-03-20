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
import './Catalog.css'

export default function Catalog() {
  const { t } = useTranslation()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { products } = useFilters()

  return (
    <div className="catalog-page">
      <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
      <Hero />

      <div className="catalog-container">
        <Sidebar />

        <main className="catalog-main">
          <SearchBar />

          <div className="results-info">
            <span className="results-count">
              {products.length} {products.length === 1 ? t('ui:products_found') : t('ui:products_found_plural')}
            </span>
          </div>

          <ProductGrid />
        </main>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  )
}
