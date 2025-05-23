import React, { useState, useContext } from 'react';
import { Form, Card, Button, Row, Col, Modal } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, registration, verifyEmail } from '../http/user';
import { $host } from '../http';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import '../Styles/Auth.css';

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

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
      try {
        let userData;
        if (!isLogin) {
          try {
            userData = await registration(email, password);
            if (userData.message) {
              setAuthError('Код подтверждения отправлен на ваш email');
              setShowVerification(true);
            } else if (userData) {
              user.setUser(userData);
              user.setIsAuth(true);
              setShowVerification(true);
            }
          } catch (error) {
            if (error.response?.data?.message?.includes('подтвердите email')) {
              setAuthError('Пожалуйста, подтвердите email. Введите код подтверждения.');
              setShowVerification(true);
            } else {
              throw error;
            }
          }
        } else {
          try {
            userData = await login(email, password);
            if (userData) {
              user.setUser(userData);
              user.setIsAuth(true);
              navigate('/');
            }
          } catch (error) {
            if (error.response?.data?.message?.includes('подтвердите email')) {
              navigate(REGISTRATION_ROUTE);
              setAuthError('Пожалуйста, подтвердите email. Введите код подтверждения.');
              setShowVerification(true);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        setAuthError(error.response?.data?.message || error.message || 'Произошла ошибка при авторизации');
      }
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const userData = await verifyEmail(email, verificationCode);
      if (userData) {
        user.setUser(userData);
        user.setIsAuth(true);
        setShowVerification(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Ошибка верификации:', error);
      setAuthError(error.response?.data?.message || error.message || 'Произошла ошибка при верификации');
    }
  };

  const handleResendCode = async () => {
    try {
      await registration(email, password);
      setAuthError('Новый код подтверждения отправлен на ваш email');
    } catch (error) {
      console.error('Ошибка при отправке кода:', error);
      setAuthError('Ошибка при отправке кода подтверждения');
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
          <div className="mt-3">
            <Button variant="link" onClick={handleResendCode} style={{ textDecoration: "none" }}>
              Отправить код повторно
            </Button>
          </div>
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
});

export default Auth;
