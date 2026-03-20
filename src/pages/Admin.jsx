import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { useFilters } from '../context/FilterContext'
import AdminForm from '../components/AdminForm'
import AdminProductList from '../components/AdminProductList'
import './Admin.css'

function Admin() {
  const { products, createProduct, updateProduct, deleteProduct, loading, error, successMessage } = useAdmin()
  const { refetch } = useFilters()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditing && selectedProduct) {
        await updateProduct(selectedProduct.id, formData)
        setIsEditing(false)
        setSelectedProduct(null)
      } else {
        await createProduct(formData)
        // Atualizar produtos no FilterContext para salão na home/catálogo
        await refetch()
      }
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsEditing(true)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      if (isEditing && selectedProduct?.id === productId) {
        setIsEditing(false)
        setSelectedProduct(null)
      }
    } catch (err) {
      console.error('Erro ao deletar produto:', err)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedProduct(null)
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Painel Administrativo - Livealoe</h1>
          <Link to="/" className="btn-back">
            ← Voltar ao Catálogo
          </Link>
        </div>
      </header>

      <div className="admin-main">
        {successMessage && (
          <div className="notification success-notification">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="notification error-notification">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <p>Carregando produtos...</p>
          </div>
        )}

        {!loading && (
          <div className="admin-content">
            <div className="admin-section">
              <AdminForm
                onSubmit={handleFormSubmit}
                initialData={selectedProduct}
                isEditing={isEditing}
              />
              {isEditing && (
                <button className="btn-cancel" onClick={handleCancel}>
                  ✕ Cancelar Edição
                </button>
              )}
            </div>

            <div className="admin-section">
              <AdminProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
