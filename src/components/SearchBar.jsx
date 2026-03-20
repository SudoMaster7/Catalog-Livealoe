import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilters } from '../context/FilterContext'
import './SearchBar.css'

export default function SearchBar() {
  const { t } = useTranslation()
  const { updateFilter, filters } = useFilters()
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [debounceTimer, setDebounceTimer] = useState(null)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)

    // Limpar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Criar novo timer para debounce (300ms)
    const timer = setTimeout(() => {
      updateFilter('search', value)
    }, 300)

    setDebounceTimer(timer)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    updateFilter('search', '')
  }

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('ui:search_placeholder')}
          value={searchValue}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchValue && (
          <button
            className="search-clear"
            onClick={handleClearSearch}
            title={t('ui:clear_filters')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
