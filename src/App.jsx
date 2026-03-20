import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/app.css'
import { FilterProvider } from './context/FilterContext'
import { CartProvider } from './context/CartContext'
import { AdminProvider } from './context/AdminContext'
import Catalog from './pages/Catalog'
import Admin from './pages/Admin'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  return (
    <BrowserRouter>
      <AdminProvider>
        <FilterProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </CartProvider>
        </FilterProvider>
      </AdminProvider>
    </BrowserRouter>
  )
}

export default App
