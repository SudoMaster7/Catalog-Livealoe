import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilters } from '../context/FilterContext'
import ProductCard from './ProductCard'
import ImageModal from './ImageModal'
import './ProductGrid.css'

export default function ProductGrid() {
  const { t } = useTranslation()
  const { products, loading } = useFilters()
  const [selectedProduct, setSelectedProduct] = useState(null)

  if (loading) {
    return <div className="product-grid-loading">{t('ui:loading')}</div>
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>{t('ui:no_products')}</p>
      </div>
    )
  }

  return (
    <>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onImageClick={setSelectedProduct}
          />
        ))}
      </div>

      {selectedProduct && (
        <ImageModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
