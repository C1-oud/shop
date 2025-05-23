const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');
const { body } = require('express-validator');

router.post(
    '/',
    checkRole('ADMIN'),
    body('name').notEmpty().withMessage('Название типа не может быть пустым'),
    typeController.create
);

router.get('/', typeController.getAll);

module.exports = router;
