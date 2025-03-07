const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');
const { body } = require('express-validator');

router.post(
    '/',
    checkRole('ADMIN'),
    body('name').notEmpty().withMessage('Название бренда не может быть пустым'),
    brandController.create
);

router.get('/', brandController.getAll);

module.exports = router;
