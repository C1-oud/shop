import React, { useState } from 'react';
import '../Styles/AddToCartButton.css';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import 'animate.css'; // Импортируем animate.css для анимации

const AddToCartButton = () => {
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAddToCart = () => {
       
        setIsAnimating(true);
        setTimeout(() => {
            setIsAdded(true); 
        }, 600); 
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
