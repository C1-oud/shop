import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Categories = () => {
    const categories = [
        { name: 'Спецодежда', img: 'https://i.pinimg.com/originals/b7/9e/75/b79e754c9874e37d2a588636554e1a7b.jpg' },
        { name: 'Утепленная одежда', img: 'https://spezcostum.ru/upload/iblock/cd4/ywy1a28se9h1c0xm2mzq71aoxpz0ec83.jpg' },
        { name: 'Разное', img: 'https://grillrest.com/wp-content/uploads/2022/01/respirator-i-perchatki.jpg' },
    ];

    return (
        <section className="my-4 text-center">
            <div className="title">Категории</div>
            <Row className="justify-content-center">
                {categories.map((category, index) => (
                    <Col md={4} key={index} className="mb-4 d-flex flex-column align-items-center">
                        <Card className="product-card" style={{ width: '280px' }}>
                            <div className="image-container">
                                <Card.Img variant="top" src={category.img} className="product-img" />
                                <Button variant="dark" className="more-info-button">Подробнее</Button>
                            </div>
                        </Card>
                        <div className="product-name mt-2">{category.name}</div> 
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default Categories;
