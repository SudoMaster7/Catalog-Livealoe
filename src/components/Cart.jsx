import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, cartEmpty } = useCart()

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>{t('ui:cart')}</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {cartEmpty ? (
            <p className="cart-empty-message">{t('ui:cart_empty')}</p>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="qty-input"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-remove-btn"
                    title={t('ui:remove')}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {!cartEmpty && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>{t('ui:total')}:</span>
              <span className="total-price">
                R$ {getTotalPrice().toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button className="btn-checkout" disabled>
              {t('ui:checkout')}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
