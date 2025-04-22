import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../http/product';
import '../Styles/Catalog.css';

const Catalog = () => {
  const categories = [
    { name: 'Рабочая обувь', id: 'footwear' },
    { name: 'Рабочая одежда', id: 'clothing' },
    { name: 'Средства индивидуальной защиты', id: 'ppe' },
    { name: 'Аксессуары', id: 'accessories' }
  ];

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('footwear');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Преобразуем категорию в typeId для API
        const typeId = getTypeIdFromCategory(selectedCategory);
        const data = await fetchProducts(null, typeId, 1, 10);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // Функция для преобразования категории в typeId
  const getTypeIdFromCategory = (category) => {
    switch (category) {
      case 'footwear': return 1; // ID для рабочей обуви
      case 'clothing': return 2; // ID для рабочей одежды
      case 'ppe': return 3; // ID для СИЗ
      case 'accessories': return 4; // ID для аксессуаров
      default: return null;
    }
  };

  // Функция для форматирования цены
  const formatPrice = (price) => {
    return `${price}₽`;
  };

  return (
    <div className="workwear-catalog">
      <div className="workwear-category-nav">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`workwear-category-nav__button ${selectedCategory === category.id ? 'workwear-category-nav__button--active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-message">Загрузка товаров...</div>
      ) : (
        <div className="workwear-product-card-container" key={selectedCategory}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id} 
                className={`animate__animated animate__fadeInLeft`}
                style={{ animationDelay: `${index * 0.1}s` }} 
              >
                <ProductCard 
                  product={{
                    ...product,
                    price: formatPrice(product.price)
                  }} 
                />
              </div>
            ))
          ) : (
            <div className="no-products-message">Товары не найдены</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;
