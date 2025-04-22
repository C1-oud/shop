import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { fetchTypes, fetchBrands, fetchDevices } from '../http/deviceAPI';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Catalog = observer(() => {
    const { device } = useContext(Context);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const { category } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [typesData, brandsData] = await Promise.all([
                    fetchTypes(),
                    fetchBrands()
                ]);
                device.setTypes(typesData);
                device.setBrands(brandsData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        loadData();
    }, [device]);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                setLoading(true);
                const typeId = getTypeIdFromCategory(category);
                const data = await fetchDevices(typeId, selectedBrand?.id, priceRange.min, priceRange.max);
                setDevices(data.rows);
            } catch (error) {
                console.error('Ошибка при загрузке устройств:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDevices();
    }, [category, selectedBrand, priceRange]);

    const getTypeIdFromCategory = (category) => {
        switch (category) {
            case 'footwear': return 1;
            case 'clothing': return 2;
            case 'ppe': return 3;
            case 'accessories': return 4;
            default: return null;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        const categoryMap = {
            1: 'footwear',
            2: 'clothing',
            3: 'ppe',
            4: 'accessories'
        };
        navigate(`/catalog/${categoryMap[type.id]}`);
    };

    const handleBrandChange = (brand) => {
        setSelectedBrand(brand);
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container>
            <Row className="mt-3">
                <Col md={3}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Категория</Form.Label>
                            <Form.Select
                                value={selectedType?.id || ''}
                                onChange={(e) => {
                                    const type = device.types.find(t => t.id === Number(e.target.value));
                                    handleTypeChange(type);
                                }}
                            >
                                <option value="">Все категории</option>
                                {device.types.map(type =>
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Бренд</Form.Label>
                            <Form.Select
                                value={selectedBrand?.id || ''}
                                onChange={(e) => {
                                    const brand = device.brands.find(b => b.id === Number(e.target.value));
                                    handleBrandChange(brand);
                                }}
                            >
                                <option value="">Все бренды</option>
                                {device.brands.map(brand =>
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Цена</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="От"
                                        name="min"
                                        value={priceRange.min}
                                        onChange={handlePriceChange}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="До"
                                        name="max"
                                        value={priceRange.max}
                                        onChange={handlePriceChange}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>

                <Col md={9}>
                    <Row>
                        {loading ? (
                            <div>Загрузка...</div>
                        ) : devices.length === 0 ? (
                            <div>Товары не найдены</div>
                        ) : (
                            devices.map(device =>
                                <Col key={device.id} xs={12} sm={6} md={4} className="mb-4">
                                    <Card style={{ height: '100%' }}>
                                        <Card.Img
                                            variant="top"
                                            src={process.env.REACT_APP_API_URL + device.img}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{device.name}</Card.Title>
                                            <Card.Text>
                                                {formatPrice(device.price)}
                                            </Card.Text>
                                            <Button
                                                variant="primary"
                                                className="mt-auto"
                                                onClick={() => navigate(`/device/${device.id}`)}
                                            >
                                                Подробнее
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
});

export default Catalog;
