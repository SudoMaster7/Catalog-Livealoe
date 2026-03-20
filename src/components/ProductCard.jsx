import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product, onImageClick }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
    alert(t('ui:success_added'))
  }

  const handleImageError = (e) => {
    console.warn('Erro ao carregar imagem:', product.image);
    e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400';
  }

  return (
    <div className="product-card">
      {/* Image Section with Tags */}
      <div className="product-image-container" onClick={() => onImageClick(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          onError={handleImageError}
          crossOrigin="anonymous"
        />
        
        {/* Floating Tags */}
        <div className="product-tags">
          {product.tags?.map((tag, idx) => (
            <span key={idx} className={`tag tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
              {tag === '100% natural' && '♻️'}
              {tag === 'IBD Ingredientes' && '✓'}
              {tag === 'IBD Vegano' && '🌱'}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-ingredients">
          <em>{product.ingredients}</em>
        </p>
        <p className="product-description">{product.description}</p>
        
        {product.fullDescription && (
          <p className="product-full-description">{product.fullDescription}</p>
        )}

        {/* Price */}
        <div className="product-footer">
          <span className="product-price">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
          >
            {t('ui:add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  )
}
