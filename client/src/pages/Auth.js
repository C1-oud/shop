import React, { useState } from 'react';
import { Form, Card, Button, Row, Col, Modal } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Styles/Auth.css';

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate(); // Инициализируем useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (!isLogin) {
        const response = await fetch('http://localhost:5000/api/registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role: 'USER',
          }),
        });
        const data = await response.json();
        if (data.message) {
          setShowVerification(true);
        } else {
          alert(data.error || 'Ошибка при отправке кода подтверждения');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const data = await response.json();
        if (data.token) {
       
          localStorage.setItem('authToken', data.token);
          alert('Вы успешно вошли!');
          
        
          navigate('/'); 
        } else {
          setAuthError(data.error || 'Неверный email или пароль');
        }
      }
    }
  };

  const handleVerificationSubmit = async () => {
    const response = await fetch('http://localhost:5000/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code: verificationCode,
      }),
    });
    const data = await response.json();
    if (data.message) {
      alert('Email подтвержден');
      setShowVerification(false);
    } else {
      alert(data.error || 'Неверный код подтверждения');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h2 className="text-center">{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column mt-4" onSubmit={handleSubmit}>
          <Form.Control
            className="auth-input"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>

          <div className="password-container mt-3">
            <Form.Control
              className="auth-input"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            <div className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {authError && <div className="text-danger mt-3">{authError}</div>}

          <Row className="d-flex justify-content-between align-items-center mt-4">
            <Col>
              {isLogin ? (
                <div className="auth-text">
                  Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Регистрация</NavLink>
                </div>
              ) : (
                <div className="auth-text">
                  Уже зарегистрированы? <NavLink to={LOGIN_ROUTE}>Войти</NavLink>
                </div>
              )}
            </Col>
            <Col className="text-end">
              <Button variant="dark" className="auth-btn" type="submit">
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal show={showVerification} onHide={() => setShowVerification(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Введите код, отправленный на ваш email:</p>
          <Form.Control
            type="text"
            placeholder="Код подтверждения"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerification(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleVerificationSubmit}>
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Auth;
