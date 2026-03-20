import React, { useState, useEffect } from 'react'
import './AdminForm.css'

// API URL dinâmica baseada no host atual
const getApiUrl = () => `http://${window.location.hostname}:3001`;

function AdminForm({ onSubmit, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'face',
    ingredients: '',
    description: '',
    fullDescription: '',
    price: '',
    imageUrl: '',
    imageFile: null,
    tags: ''
  })

  const [errors, setErrors] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'face',
        ingredients: initialData.ingredients || '',
        description: initialData.description || '',
        fullDescription: initialData.fullDescription || '',
        price: initialData.price || '',
        imageUrl: initialData.image || '',
        imageFile: null,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : ''
      })
      setImagePreview(initialData.image || '')
    }
  }, [initialData, isEditing])

  const categories = ['face', 'body', 'hair', 'supplements', 'kits']

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória'
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredientes são obrigatórios'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Preço inválido'
    if (!formData.category) newErrors.category = 'Categoria é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: '' // Limpar URL se arquivo foi selecionado
    }))
  }

  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imageFile: null // Limpar arquivo se URL foi inserida
    }))
    if (url) {
      setImagePreview(url)
    }
  }

  const uploadImage = async (file) => {
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${getApiUrl()}/api/upload`, {
        method: 'POST',
        body: formDataUpload
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      // Retorna a URL diretamente (pode ser Google Drive ou local)
      return data.imageUrl
    } catch (err) {
      throw new Error('Erro ao fazer upload: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setUploadingImage(true)

    try {
      let finalImageUrl = formData.imageUrl

      // Se há arquivo, fazer upload
      if (formData.imageFile) {
        finalImageUrl = await uploadImage(formData.imageFile)
      }

      const submitData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients,
        description: formData.description,
        fullDescription: formData.fullDescription || '',
        imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      // Remover imageFile do objeto enviado
      delete submitData.imageFile

      await onSubmit(submitData)
      
      if (!isEditing) {
        setFormData({
          name: '',
          category: 'face',
          ingredients: '',
          description: '',
          fullDescription: '',
          price: '',
          imageUrl: '',
          imageFile: null,
          tags: ''
        })
        setImagePreview('')
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message
      }))
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="admin-form-container">
      <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        {errors.submit && <div className="form-error-message">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="name">Nome do Produto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Ex: Hidratante Facial Aloe"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Categoria *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço (R$) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Descreva o produto..."
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fullDescription">Descrição Completa (Detalhes Expandidos)</label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            placeholder="Adicione detalhes mais completos sobre o produto, modo de uso, benefícios, etc..."
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredientes *</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className={errors.ingredients ? 'error' : ''}
            placeholder="Liste os ingredientes separados por vírgula"
            rows="3"
          />
          {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (separadas por vírgula)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Ex: aloe, natural, vegano"
          />
        </div>

        {/* Seção de Imagem */}
        <div className="image-section">
          <div className="section-title">📸 Imagem do Produto</div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="imageFile">Upload de Arquivo</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleImageFileChange}
                className="file-input"
              />
              <small>Formatos: JPG, PNG, GIF, WebP (máx 5MB)</small>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">OU Link de Imagem</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <small>Preview da imagem</small>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={uploadingImage}
          >
            {uploadingImage ? '⏳ Processando...' : (isEditing ? 'Atualizar Produto' : 'Criar Produto')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminForm
