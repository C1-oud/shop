import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AddProduct from '../components/admin/AddProduct';

const Admin = () => {
    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Панель администратора</h2>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Управление товарами</h4>
                        </Card.Header>
                        <Card.Body>
                            <AddProduct />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Admin;