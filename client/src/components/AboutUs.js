import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaTshirt, FaTruck, FaHeadset } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <section className="my-5 text-center pt ">
            <div className="title">О нас</div>

            <Row className="mt-3 about-text">
                <Col md={4}>
                    <FaTshirt size={40} />
                    <h5>Широкий ассортимент</h5>
                    <p>Одежда для разных сфер и требований.</p>
                </Col>
                <Col md={4}>
                    <FaTruck size={40} />
                    <h5>Быстрая доставка</h5>
                    <p>Отправляем в течение 10 дней с бесплатной доставкой при заказ от 100 рублей.</p>
                </Col>
                <Col md={4}>
                    <FaHeadset size={40} />
                    <h5>Поддержка</h5>
                    <p>Готовы ответить на любые вопросы с 9 до 18.</p>
                </Col>
            </Row>
        </section>
    );
};

export default AboutUs;
