import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import "../Styles/AdminPanel.css"; 

const AdminPanel = observer(() => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost:5000/api/product", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Товар успешно добавлен!");
                setName("");
                setPrice("");
                setImage(null);
            } else {
                alert("Ошибка при добавлении товара.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="admin-panel">
            <Card className="admin-card">
                <h2>Добавить товар</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Название товара</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Цена</Form.Label>
                        <Form.Control
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Изображение</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} required />
                    </Form.Group>

                    <Button variant="dark" type="submit" className="mt-4">
                        Добавить товар
                    </Button>
                </Form>
            </Card>
        </div>
    );
});

export default AdminPanel;
