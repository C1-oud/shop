import React, { useState } from 'react';
import AddToCartButton from '../components/AddToCartButton';
import { FaHeart } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'; 
import '../Styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false); 

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); 
  };

  // Формируем URL изображения
  const imageUrl = product.img ? 
    (product.img.startsWith('http') ? product.img : `${process.env.REACT_APP_API_URL}/static/${product.img}`) : 
    'https://via.placeholder.com/300x300?text=Нет+изображения';

  return (
    <div className="unique-product-card">
      <div className="unique-image-wrapper">
        <img src={imageUrl} alt={product.name} className="unique-product-image" />

        <Link to={`/product/${product.id}`} className="unique-more-info-button">
          Подробнее
        </Link>
        
        <FaHeart 
          className={`favorite-icon ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        />
      </div>
      <div className="unique-product-info">
        <h4 className="unique-product-name">{product.name}</h4>
        <p className="unique-product-brand">{product.brand?.name || 'Бренд не указан'}</p>
        <p className="unique-product-price">{product.price}</p>
        
        <div className="unique-add-to-cart-button-wrapper">
          <AddToCartButton className="add-to-cart-button" productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
