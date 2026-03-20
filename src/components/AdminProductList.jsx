import React from 'react'
import './AdminProductList.css'

function AdminProductList({ products, onEdit, onDelete }) {
  const handleImageError = (e) => {
    console.warn('Erro ao carregar imagem:', e.target.src)
    e.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'
  }

  if (products.length === 0) {
    return (
      <div className="admin-list-container">
        <h2>Produtos ({products.length})</h2>
        <div className="empty-state">
          <p>Nenhum produto encontrado. Crie o primeiro produto!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-list-container">
      <h2>Produtos ({products.length})</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="product-row">
                <td className="product-name">
                  <div className="name-cell">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-thumb"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="product-category">
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="product-price">R$ {product.price.toFixed(2)}</td>
                <td className="product-status">
                  <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                  </span>
                </td>
                <td className="product-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(product)}
                    title="Editar produto"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja deletar "${product.name}"?`)) {
                        onDelete(product.id)
                      }
                    }}
                    title="Deletar produto"
                  >
                    🗑️ Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductList
