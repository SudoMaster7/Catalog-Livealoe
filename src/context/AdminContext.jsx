import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

// API URL dinâmica baseada no host atual
const getApiUrl = () => `http://${window.location.hostname}:3001/api`;

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const API_URL = getApiUrl()

  // Carregar produtos
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      setProducts(data.products || [])
      setError(null)
    } catch (err) {
      setError('Erro ao carregar produtos: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Criar produto
  const createProduct = async (productData) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar produto')
      }

      const data = await response.json()
      setProducts([...products, data.product])
      setSuccessMessage('Produto criado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
      return data.product
    } catch (err) {
      const errorMsg = 'Erro ao criar produto: ' + err.message
      setError(errorMsg)
      throw err
    }
  }

  // Atualizar produto
  const updateProduct = async (productId, productData) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar produto')
      }

      const data = await response.json()
      setProducts(products.map(p =>
        p.id === productId ? data.product : p
      ))
      setSuccessMessage('Produto atualizado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
      return data.product
    } catch (err) {
      const errorMsg = 'Erro ao atualizar produto: ' + err.message
      setError(errorMsg)
      throw err
    }
  }

  // Deletar produto
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar produto')
      }

      setProducts(products.filter(p => p.id !== productId))
      setSuccessMessage('Produto deletado com sucesso!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      const errorMsg = 'Erro ao deletar produto: ' + err.message
      setError(errorMsg)
      throw err
    }
  }

  const value = {
    products,
    loading,
    error,
    successMessage,
    setError,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
