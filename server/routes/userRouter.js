const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/registration',
    [
        body('email').isEmail().withMessage('Некорректный email'),
        body('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов')
    ],
    userController.registration
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Некорректный email'),
        body('password').exists().withMessage('Пароль не может быть пустым')
    ],
    userController.login
);

router.post('/verify-email', userController.verifyEmail);

router.get('/check', authMiddleware, userController.check);

module.exports = router;
