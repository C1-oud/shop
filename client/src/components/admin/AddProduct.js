import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { createProduct } from '../../http/productAPI';
import { fetchCategories } from '../../http/categoryAPI';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (e) {
                setError('Ошибка при загрузке категорий');
            }
        };
        loadCategories();
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
            formData.append('brand', brand);
            formData.append('categoryId', categoryId);
            formData.append('img', file);

            await createProduct(formData);
            setSuccess('Товар успешно добавлен');
            // Очищаем форму
            setName('');
            setPrice('');
            setBrand('');
            setCategoryId('');
            setFile(null);
        } catch (e) {
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
                                    <Form.Control
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
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