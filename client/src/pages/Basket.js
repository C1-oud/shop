import React, { useState } from 'react';
import '../Styles/Basket.css';
import { FiTrash2 } from 'react-icons/fi';

const Basket = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      category: "footwear",
      name: "Ботинки",
      price: "1500",
      img: "https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg",
      size: "",
      quantity: 1,
      description: "Удобные и прочные ботинки для любых погодных условий.",
    },
    {
      id: 2,
      category: "footwear",
      name: "Кроссовки",
      price: "2000",
      img: "https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg",
      size: "",
      quantity: 1,
      description: "Легкие и стильные кроссовки для повседневной носки.",
    },
    {
      id: 3,
      category: "clothing",
      name: "Куртка",
      price: "2500",
      img: "https://i.ebayimg.com/00/s/MTYwMFgxNDQ2/z/jVAAAOxyOlhSxxG8/$_57.JPG?set_id=8800005007",
      size: "",
      quantity: 1,
      description: "Теплая куртка для холодной погоды с водоотталкивающим покрытием.",
    },
  ]);

  const [favorites, setFavorites] = useState([]); 

  const handleQuantityChange = (id, action) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: action === "increase" ? item.quantity + 1 : Math.max(item.quantity - 1, 0),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSizeSelect = (id, size) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, size: size } : item))
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favoriteId) => favoriteId !== id)
        : [...prevFavorites, id]
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };
  
  const totalPrice = items.reduce((acc, item) => acc + item.quantity * parseInt(item.price), 0);

  return (
    <div className="basket">
      <div className="basket-items">
        {items.map((item) => (
          <div key={item.id} className="basket-item">
            <div className="basket-item-image-container">
              <img src={item.img} alt={item.name} className="basket-item-image" />
              <div className="basket-item-buttons">
                <button onClick={() => handleQuantityChange(item.id, "decrease")}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, "increase")}>+</button>
                <button
                  className={`basket-favorite-btn ${
                    favorites.includes(item.id) ? "active" : ""
                  }`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={favorites.includes(item.id) ? "#333" : "none"}
                    stroke={favorites.includes(item.id) ? "none" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-heart"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button className="basket-delete-btn" onClick={() => handleRemoveItem(item.id)}>
                <FiTrash2 size={20} />
              </button>

              </div>
            </div>

            <div className="item-details">
              <h3 className="basket-item-name">{item.name}</h3>
              <p className="basket-item-category">{item.category}</p>
              <p className="basket-item-description">{item.description}</p>

              <div className="basket-size-selector">
                {item.category === "footwear"
                  ? ["37", "38", "39", "40", "41"].map((size) => (
                      <button
                        key={size}
                        className={`basket-size-btn ${
                          item.size === size ? "selected" : ""
                        }`}
                        onClick={() => handleSizeSelect(item.id, size)}
                      >
                        {size}
                      </button>
                    ))
                  : ["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        className={`basket-size-btn ${
                          item.size === size ? "selected" : ""
                        }`}
                        onClick={() => handleSizeSelect(item.id, size)}
                      >
                        {size}
                      </button>
                    ))}
              </div>
            </div>

            <div className="basket-item-price">{item.price}₽</div>
          </div>
        ))}
      </div>

     <div className="basket-summary"> 
        <div className="basket-total-price">
          <span>Общая стоимость:</span>
          <span>{totalPrice}₽</span>
        </div>

        <div className="basket-payment-form">
          <div className="basket-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Введите ваш email" />
          </div>
          <div className="basket-form-group">
            <label htmlFor="address">Адрес</label>
            <input type="text" id="address" placeholder="Введите ваш адрес" />
          </div>
          <div className="basket-form-group">
            <label htmlFor="fullName">ФИО</label>
            <input type="text" id="fullName" placeholder="Введите ваше ФИО" />
          </div>
          <div className="basket-form-group">
            <label htmlFor="phone">Номер телефона</label>
            <input type="tel" id="phone" placeholder="Введите ваш номер телефона" />
          </div>
        </div>

        <button className="basket-checkout-btn">Перейти к оформлению</button>
      </div>

    </div>
  );
};

export default Basket;
