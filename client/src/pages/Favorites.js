import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'; 
import FavoritesCard from '../components/FavoritesCard';  
import '../Styles/Favorites.css';  

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      setFavorites([
        {
          id: 1,
          category: "footwear",
          name: "Ботинки",
          img: "https://ir.ozone.ru/s3/multimedia-7/c1000/6041810695.jpg",
          quantity: 1,
          description: "Удобные и прочные ботинки для любых погодных условий.",
        },
        {
          id: 2,
          category: "footwear",
          name: "Кроссовки",
          img: "https://www.ronta.ru/upload/iblock/02a/5hko4y2ev0au97sjr5zm186n92ic1qfg.jpg",
          quantity: 1,
          description: "Легкие и стильные кроссовки для повседневной носки.",
        },
        {
          id: 3,
          category: "clothing",
          name: "Куртка",
          img: "https://i.ebayimg.com/00/s/MTYwMFgxNDQ2/z/jVAAAOxyOlhSxxG8/$_57.JPG?set_id=8800005007",
          quantity: 1,
          description: "Теплая куртка для холодной погоды с водоотталкивающим покрытием.",
        },
      ]);
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  const toggleFavorite = (id) => {
    if (favorites.find(item => item.id === id)) {
      setFavorites(favorites.filter(item => item.id !== id));
    } else {
      const item = {
        id,
        name: `Товар ${id}`,
        img: "Изображение",
        description: "Описание",
      };
      setFavorites([...favorites, item]);
    }
  };

  return (
    <div className="favorites-page">
      <h1>Избранное</h1>
      {favorites.length > 0 ? (
        <div className="favorites-list">
          {favorites.map(product => (
            <FavoritesCard
              key={product.id}
              product={product}
              onRemove={() => removeFromFavorites(product.id)}
              toggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>
      ) : (
        <p>У вас нет товаров в избранном.</p>
      )}
    </div>
  );
};

export default observer(Favorites);
