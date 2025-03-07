import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для перехода
import '../Styles/PopularCard.css';

const ProductSection = () => {
    const products = [
        { id: 1, name: 'Куртка утепленная', price: '2500₽', img: 'https://avatars.mds.yandex.net/get-altay/13206609/2a0000018f3d765192ae6ab0cb5e5bdfd283/XXL_height' },
        { id: 2, name: 'Защитные ботинки', price: '1500₽', img: 'https://avatars.mds.yandex.net/i?id=5453021b2f975de67d7243ff1dc348f3d3a4c36e-10870279-images-thumbs&n=13' },
        { id: 3, name: 'Халат рабочий', price: '3000₽', img: 'https://kpdi.by/image/cache/catalog/specodezhda/sirius/halati/favorit-sinij3-500x500.jpg' },
    ];

    const [favorites, setFavorites] = useState({});
    const navigate = useNavigate(); // Инициализируем useNavigate

    const toggleFavorite = (index) => {
        setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [index]: !prevFavorites[index],
        }));
    };

    // Функция для перехода на страницу каталога
    const handleSeeMore = () => {
        navigate('/catalog'); // Переход на страницу каталога
    };

    // Функция для перехода на страницу товара
    const handleProductDetails = (id) => {
        navigate(`/product/${id}`); // Переход на страницу товара по id
    };

    return (
        <section className="my-4 popular-section pt">
            <div className="popular-title-container">
                <div className="title">Популярные</div>
                <div className="title">товары</div> 
                <Button variant="link" className="more-button" onClick={handleSeeMore}>
                    Еще <span className="arrow">→</span>
                </Button>
            </div>
            <Row>
                {products.map((product, index) => (
                    <Col md={4} key={index} className="mb-4">
                        <Card className="popular-card">
                            <div className="image-container">
                                <Card.Img variant="top" src={product.img} className="popular-img" />
                                <div className="price-tag">{product.price}</div>
                                <Button 
                                    variant="dark" 
                                    className="more-info-button" 
                                    onClick={() => handleProductDetails(product.id)} // Переход на страницу товара
                                >
                                    Подробнее
                                </Button>
                                <FaHeart 
                                    className={`favorite-icon ${favorites[index] ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(index)}
                                />
                            </div>
                        </Card>
                        <div className="popular-name">{product.name}</div>
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default ProductSection;
