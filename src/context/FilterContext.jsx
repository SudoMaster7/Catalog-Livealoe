import React, { createContext, useContext, useState, useEffect } from 'react';

const FilterContext = createContext();

// API URL dinâmica baseada no host atual
const getApiUrl = () => `http://${window.location.hostname}:3001/api`;

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 100,
    search: '',
    sort: 'relevance'
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  // Carregar produtos da API
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchPriceRange();
  }, []);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPriceRange = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/price-range`);
      const data = await response.json();
      setPriceRange(data);
      setFilters(prev => ({
        ...prev,
        minPrice: data.min,
        maxPrice: data.max
      }));
    } catch (error) {
      console.error('Error fetching price range:', error);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Filtro de categoria
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Filtro de preço
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.ingredients.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    switch (filters.sort) {
      case 'lowest_price':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'highest_price':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'relevance':
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      search: '',
      sort: 'relevance'
    });
  };

  const value = {
    filters,
    updateFilter,
    clearFilters,
    products: filteredProducts,
    allProducts: products,
    categories,
    priceRange,
    loading,
    refetch: fetchProducts
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
