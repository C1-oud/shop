import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas, Modal, Form } from "react-bootstrap";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import Lottie from "react-lottie";
import favAnimation from "../animations/fav.json";
import basketAnimation from "../animations/basket.json";
import shopAnimation from "../animations/shop.json";
import InputMask from 'react-input-mask';
import { FaShoppingCart, FaHeart, FaStore, FaBars } from "react-icons/fa";
import { LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE, ADMIN_ROUTE, CATALOG_ROUTE, FAVORITES_ROUTE } from "../utils/consts";
import "../Styles/NavBar.css";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        address: "",
        phone: ""
    });

    console.log('NavBar rendered, auth state:', user.isAuth, 'user data:', user.user);

    const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
    const logOut = () => {
        console.log('Logging out...');
        user.setUser({});
        user.setIsAuth(false);
        console.log('Auth state after logout:', user.isAuth);
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSave = () => {
        console.log("Сохраненные данные профиля:", profileData);
        setShowProfileModal(false);
    };

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: null,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
    };

    return (
        <>
            <Navbar expand="lg" className="nav-bg mb-4 fixed-top">
                <Container fluid>
                    <Navbar.Brand as={Link} to={SHOP_ROUTE} className="brand ms-2">
                        <h3>ТД Спарки</h3>
                    </Navbar.Brand>

                    <Nav className="mx-auto d-none d-lg-flex">
                        <NavLink
                            to={CATALOG_ROUTE}
                            className="nav-icon-text nav-text-color"
                            onMouseEnter={() => setHoveredIcon("shop")}
                            onMouseLeave={() => setHoveredIcon(null)}
                            onClick={() => navigate(CATALOG_ROUTE)}
                        >
                            <Lottie
                                options={{ ...defaultOptions, animationData: shopAnimation }}
                                height={40}
                                width={40}
                                isStopped={hoveredIcon !== "shop"}
                                isPaused={hoveredIcon !== "shop"}
                            />
                            <span>Каталог</span>
                        </NavLink>

                        <NavLink
                            to={user.isAuth ? BASKET_ROUTE : LOGIN_ROUTE}
                            className="nav-icon-text nav-text-color"
                            onMouseEnter={() => setHoveredIcon("basket")}
                            onMouseLeave={() => setHoveredIcon(null)}
                            onClick={() => navigate(user.isAuth ? BASKET_ROUTE : LOGIN_ROUTE)}
                        >
                            <Lottie
                                options={{ ...defaultOptions, animationData: basketAnimation }}
                                height={40}
                                width={40}
                                isStopped={hoveredIcon !== "basket"}
                                isPaused={hoveredIcon !== "basket"}
                            />
                            <span>Корзина</span>
                        </NavLink>

                        <NavLink
                            to={FAVORITES_ROUTE}
                            className="nav-icon-text nav-text-color"
                            onMouseEnter={() => setHoveredIcon("fav")}
                            onMouseLeave={() => setHoveredIcon(null)}
                        >
                            <Lottie
                                options={{ ...defaultOptions, animationData: favAnimation }}
                                height={40}
                                width={40}
                                isStopped={hoveredIcon !== "fav"}
                                isPaused={hoveredIcon !== "fav"}
                            />
                            <span>Избранное</span>
                        </NavLink>
                    </Nav>

                    <Nav className="me-2 d-none d-lg-flex">
                        {user.isAuth ? (
                            <>
                            {user.user?.role === "ADMIN" && ( 
                                <Button onClick={() => navigate(ADMIN_ROUTE)} variant="dark" className="mx-2">
                                Админ панель
                                </Button>
                            )}
                            {user.user?.role === "USER" && (
                                <Button onClick={() => setShowProfileModal(true)} variant="dark" className="mx-2">
                                Профиль
                                </Button>
                            )}
                            <Button onClick={logOut} variant="dark" className="mx-2">
                                Выйти
                            </Button>
                            </>
                        ) : (
                            <Button onClick={() => navigate(LOGIN_ROUTE)} variant="dark" className="mx-2">
                            Авторизация
                            </Button>
                        )}
                        </Nav>

                    <Button variant="light" onClick={toggleOffcanvas} className="d-lg-none ms-auto me-2">
                        <FaBars />
                    </Button>

                    <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="end" className="offcanvas-bg mob-menu-bg">
                        <Offcanvas.Header closeButton />
                        <Offcanvas.Body>
                            <Nav className="flex-column">
                                <NavLink className="nav-p" as={Link} to={CATALOG_ROUTE} onClick={toggleOffcanvas}>
                                    <FaStore style={{ marginRight: "5px" }} /> Каталог
                                </NavLink>
                                <NavLink className="nav-p" as={Link} to={BASKET_ROUTE} onClick={toggleOffcanvas}>
                                    <FaShoppingCart style={{ marginRight: "5px" }} /> Корзина
                                </NavLink>
                                <NavLink className="nav-p" as={Link} to={FAVORITES_ROUTE} onClick={toggleOffcanvas}>
                                    <FaHeart style={{ marginRight: "5px" }} /> Избранное
                                </NavLink>
                                {user.isAuth ? (
                                    <>
                                        {user.user?.role === "ADMIN" && (  
                                        <Button onClick={() => { navigate(ADMIN_ROUTE); toggleOffcanvas(); }} variant="dark" className="mt-2">
                                            Админ панель
                                        </Button>
                                        )}
                                        {user.user?.role === "USER" && (
                                        <Button onClick={() => { setShowProfileModal(true); toggleOffcanvas(); }} variant="dark" className="mt-2">
                                            Профиль
                                        </Button>
                                        )}
                                        <Button onClick={logOut} variant="dark" className="mt-2">
                                            Выйти
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => { navigate(LOGIN_ROUTE); toggleOffcanvas(); }} variant="dark" className="mt-2">
                                        Авторизация
                                    </Button>
                                )}
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Container>
            </Navbar>

            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
                <Modal.Header>
                    <Modal.Title>Профиль</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>ФИО</Form.Label>
                            <Form.Control type="text" name="fullName" value={profileData.fullName} placeholder="Введите ФИО" onChange={handleProfileChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                placeholder="Введите вашу почту"
                                required
                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,}$"
                                title="Введите корректный адрес электронной почты"
                                isInvalid={profileData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profileData.email)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control type="text" name="address" value={profileData.address} placeholder="Введите адрес" onChange={handleProfileChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <InputMask
                                mask="+375 (99) 999-99-99"
                                placeholder="Введите номер телефона"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                            >
                                {(inputProps) => <Form.Control {...inputProps} type="tel" name="phone" />}
                            </InputMask>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleProfileSave}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default NavBar;
