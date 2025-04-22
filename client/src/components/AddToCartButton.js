import React, { useState, useContext } from 'react';
import '../Styles/AddToCartButton.css';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import 'animate.css'; // Импортируем animate.css для анимации
import { Context } from '../index';
import { addToBasket } from '../http/basketAPI';

const AddToCartButton = ({ productId }) => {
    const { user } = useContext(Context);
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState(null);

    const handleAddToCart = async () => {
        if (!user.isAuth) {
            setError('Для добавления товара в корзину необходимо авторизоваться');
            return;
        }

        try {
            await addToBasket(productId, quantity);
            setIsAnimating(true);
            setTimeout(() => {
                setIsAdded(true);
            }, 600);
        } catch (err) {
            console.error('Ошибка при добавлении в корзину:', err);
            setError('Не удалось добавить товар в корзину');
        }
    };

    const handleRemove = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAdd = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="add-to-cart-container">
            {error && <div className="error-message">{error}</div>}
            
            {!isAdded ? (
                <button
                    className={`add-to-cart-btn ${isAnimating ? 'fade-out' : ''}`}
                    onClick={handleAddToCart}
                >
                    <FaShoppingCart className="cart-icon" />
                    <span className={`cart-text ${isAnimating ? 'fade-out' : ''}`}>В корзину</span>
                </button>
            ) : (
                <div className={`cart-buttons ${isAnimating ? 'buttons-appear animate__animated animate__bounceIn' : ''}`}>
                    <button className="quantity-btn" onClick={handleRemove}>
                        <FaMinus />
                    </button>
                    <button className="quantity-btn quantity-display">
                        {quantity}
                    </button>
                    <button className="quantity-btn" onClick={handleAdd}>
                        <FaPlus />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddToCartButton;
