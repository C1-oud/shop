import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import '../Styles/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const products = [
    { id: 1, name: 'Кроссовки', price: 5000, img: 'https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg', brand: 'Adidas', description: 'Удобные спортивные кроссовки для активного отдыха.Удобные спортивные кроссовки для активного отдыхаУдобные спортивные кроссовки для активного отдыхаУдобные спортивные кроссовки для активного отдыхаУдобные спортивные кроссовки для активного отдыха' },
    { id: 3, name: 'Куртка', price: 8000, img: 'https://i.ebayimg.com/00/s/MTYwMFgxNDQ2/z/jVAAAOxyOlhSxxG8/$_57.JPG?set_id=8800005007', brand: 'Nike', description: 'Модная зимняя куртка для холодной погоды.' }
  ];

  useEffect(() => {
    const foundProduct = products.find((product) => product.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change)); 
  };

  const handleQuantityInputChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const getDiscountedPrice = (quantity) => {
    if (!product) return 0;
    if (quantity >= 2000) {
      return product.price * 0.85; 
    } else if (quantity >= 1000) {
      return product.price * 0.90; 
    } else if (quantity >= 600) {
      return product.price * 0.95; 
    }
    return product.price;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const totalPrice = quantity > 0 ? getDiscountedPrice(quantity) * quantity : 0;

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="product-page">
      <div className="product-details">
        <div className="product-image">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <h3>{product.brand}</h3>
          <p className="product-price">
            {getDiscountedPrice(quantity)}₽
          </p>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="size-selection">
            <h4>Размер:</h4>
            <div className="sizes">
              {['36', '37', '38', '39', '40', '41', '42'].map((size) => (
                <Button
                  key={size}
                  variant="contained"
                  color={selectedSize === size ? 'dark' : 'default'} 
                  onClick={() => handleSizeSelect(size)}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`} 
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="quantity-section">
            <h4>Количество:</h4>
            <div className="quantity-controls">
              <button 
                className="quantity-button" 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity === 1}
              >
                -
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={quantity} 
                onChange={handleQuantityInputChange}
              />
              <button 
                className="quantity-button" 
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="discount-info">
            <h4>Скидки при заказе:</h4>
            <div className="discount-cards">
              <div className="discount-card">
                <p>600 шт. — 5% скидка</p>
                <p>Цена: {getDiscountedPrice(600)}₽</p>
              </div>
              <div className="discount-card">
                <p>1000 шт. — 10% скидка</p>
                <p>Цена: {getDiscountedPrice(1000)}₽</p>
              </div>
              <div className="discount-card">
                <p>2000 шт. — 15% скидка</p>
                <p>Цена: {getDiscountedPrice(2000)}₽</p>
              </div>
            </div>
          </div>

          <div className="price-info">
            <p>Общая стоимость ({quantity} шт.): {totalPrice}₽</p>
          </div>

          <button className="add-to-cart-dark-btn">
            <i className="fas fa-shopping-cart"></i>
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
