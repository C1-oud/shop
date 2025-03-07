import React from 'react';
import '../Styles/FavoritesCard.css'; 

const FavoritesCard = ({ product, isFavorite, toggleFavorite }) => {
  return (
    <div className="favorites-card">
      <div className="favorites-card-image-container">
        <img src={product.img} alt={product.name} className="favorites-card-image" />
      </div>
      <div className="favorites-card-info">
        <h3 className="favorites-card-name">{product.name}</h3>
        <p className="favorites-card-description">{product.description}</p>
        <div className="favorites-card-footer">
          <button
                   className={`favorites-favorite-btn ${isFavorite ? "active" : ""}`}
                   onClick={toggleFavorite}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#333"
                    className="feather feather-heart"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>

                </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesCard;
