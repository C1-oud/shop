import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { createProduct } from '../../http/productAPI';
import { fetchBrands } from '../../http/brandAPI';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [brandId, setBrandId] = useState('');
    const [typeId, setTypeId] = useState('');
    const [file, setFile] = useState(null);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        { id: 1, name: 'Рабочая обувь' },
        { id: 2, name: 'Рабочая одежда' },
        { id: 3, name: 'Средства индивидуальной защиты' },
        { id: 4, name: 'Аксессуары' }
    ];

    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await fetchBrands();
                setBrands(data);
            } catch (e) {
                console.error('Ошибка при загрузке брендов:', e);
                setError('Ошибка при загрузке брендов');
            }
        };
        loadBrands();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!file) {
            setError('Пожалуйста, выберите изображение');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('brandId', brandId);
            formData.append('typeId', typeId);
            formData.append('img', file);

            await createProduct(formData);
            setSuccess('Товар успешно добавлен');
            setName('');
            setPrice('');
            setBrandId('');
            setTypeId('');
            setFile(null);
        } catch (e) {
            console.error('Ошибка при добавлении товара:', e);
            setError('Ошибка при добавлении товара');
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h3>Добавить новый товар</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Название товара</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Цена</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Бренд</Form.Label>
                                    <Form.Select
                                        value={brandId}
                                        onChange={(e) => setBrandId(e.target.value)}
                                        required
                                    >
                                        <option value="">Выберите бренд</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Select
                                        value={typeId}
                                        onChange={(e) => setTypeId(e.target.value)}
                                        required
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Изображение товара</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                    />
                                </Form.Group>

                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success mt-3">
                                        {success}
                                    </div>
                                )}

                                <Button variant="primary" type="submit" className="w-100">
                                    Добавить товар
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddProduct; 