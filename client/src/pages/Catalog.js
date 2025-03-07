import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../Styles/Catalog.css';

const Catalog = () => {
  const categories = [
    { name: 'Рабочая обувь', id: 'footwear' },
    { name: 'Рабочая одежда', id: 'clothing' },
    { name: 'Средства индивидуальной защиты', id: 'ppe' },
    { name: 'Аксессуары', id: 'accessories' }
  ];

  const products = [
    {id: 1, category: 'footwear', name: 'Ботинки', price: '1500₽', img: 'https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg' },
    {id: 2, category: 'footwear', name: 'Кроссовки', price: '2000₽', img: 'https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg' },
    {id: 3, category: 'clothing', name: 'Куртка', price: '2500₽', img: 'https://i.ebayimg.com/00/s/MTYwMFgxNDQ2/z/jVAAAOxyOlhSxxG8/$_57.JPG?set_id=8800005007' },
    {id: 4, category: 'clothing', name: 'Халат', price: '800₽', img: 'https://bober71.ru/upload/iblock/60f/u59grm1z8g94f5zr1en2ah5g25oww2pf.jpg' },
    {id: 5, category: 'footwear', name: 'Ботинки', price: '1500₽', img: 'https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg' },
    {id: 6,category: 'footwear', name: 'Кроссовки', price: '2000₽', img: 'https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg' },
    {id: 7, category: 'footwear', name: 'Ботинки', price: '1500₽', img: 'https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg' },
    {id: 8, category: 'footwear', name: 'Кроссовки', price: '2000₽', img: 'https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg' },
    {id: 9, category: 'footwear', name: 'Ботинки', price: '1500₽', img: 'https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg' },
    {id: 10, category: 'footwear', name: 'Кроссовки', price: '2000₽', img: 'https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('footwear');

  const filteredProducts = products.filter(product => product.category === selectedCategory);

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
      

      <div className="workwear-product-card-container" key={selectedCategory}>
        {filteredProducts.map((product, index) => (
          <div
            key={product.name} 
            className={`animate__animated animate__fadeInLeft`}
            style={{ animationDelay: `${index * 0.1}s` }} 
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
