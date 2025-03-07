import React from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import '../Styles/Shop.css'; 

export const Search = () => {
  return (
    <Row className="peach-bg rounded p-4 mb-4 align-items-center">
          <Col md={7} className="text-color">
            <h1>Надежная спецодежда для вашей безопасности</h1>
            <p>Одежда для профессионалов с качественными стандартами</p>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Что вы ищете?"
                className="me-2 custom-search"
              />
              <Button variant="dark">
                <FaSearch />
              </Button>
            </Form>
          </Col>
          <Col md={5}>
            <img
              src="https://mbkaliningrad.ru/upload/iblock/fbb/male-worker-at-a-factory.jpg"
              alt="Workwear"
              className="img-fluid rounded"
            />
          </Col>
        </Row>
  )
}

export default Search;