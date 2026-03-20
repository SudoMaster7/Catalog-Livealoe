import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './ImageModal.css'

export default function ImageModal({ product, onClose }) {
  const { t } = useTranslation()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
    alert(t('ui:success_added'))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleImageError = (e) => {
    console.warn('Erro ao carregar imagem no modal:', product.image);
    e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400';
  }

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">
          <div className="modal-image-section">
            <img 
              src={product.image} 
              alt={product.name} 
              className="modal-image"
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          </div>

          <div className="modal-info-section">
            <h2>{product.name}</h2>
            <p className="modal-ingredients">
              <strong>{t('ui:ingredients')}:</strong> {product.ingredients}
            </p>
            <p className="modal-description">{product.description}</p>
            
            {product.fullDescription && (
              <div className="modal-full-description">
                <p>{product.fullDescription}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="modal-tags">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="modal-tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="modal-footer">
              <span className="modal-price">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <button
                className="btn-modal-add"
                onClick={handleAddToCart}
              >
                {t('ui:add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
