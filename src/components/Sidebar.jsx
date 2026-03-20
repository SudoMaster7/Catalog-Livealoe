import { useTranslation } from 'react-i18next'
import { useFilters } from '../context/FilterContext'
import './Sidebar.css'

export default function Sidebar() {
  const { t } = useTranslation()
  const { filters, updateFilter, clearFilters, categories } = useFilters()

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Clear Filters Button */}
        <button className="btn-clear-filters" onClick={clearFilters}>
          {t('ui:clear_filters')}
        </button>

        {/* Category Filter */}
        <div className="filter-group">
          <h3>{t('ui:category')}</h3>
          <div className="filter-options">
            <label>
              <input
                type="radio"
                name="category"
                value="all"
                checked={filters.category === 'all'}
                onChange={(e) => updateFilter('category', e.target.value)}
              />
              {t('ui:all_categories')}
            </label>
            {categories.map(category => (
              <label key={category}>
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                />
                {t(`products:categories.${category}`, { defaultValue: category })}
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <h3>{t('ui:sort')}</h3>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="sort-select"
          >
            <option value="relevance">{t('ui:sort_relevance')}</option>
            <option value="lowest_price">{t('ui:sort_lowest_price')}</option>
            <option value="highest_price">{t('ui:sort_highest_price')}</option>
            <option value="newest">{t('ui:sort_newest')}</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
