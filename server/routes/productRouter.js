const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');
const checkRole = require('../middleware/checkRoleMiddleware'); 
const validateProduct = require('../middleware/validateProductMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { param } = require('express-validator');


router.post(
    '/',
    checkRole('ADMIN'),
    upload.single('img'),
    validateProduct,
    productController.create
);

router.get('/', productController.getAll);

router.get(
    '/:id',
    param('id').isInt().withMessage('ID продукта должен быть числом'),
    productController.getOne
);

router.put(
    '/:id',
    checkRole('ADMIN'),
    upload.single('img'),
    validateProduct,
    productController.update
);

router.delete(
    '/:id',
    checkRole('ADMIN'),
    param('id').isInt().withMessage('ID продукта должен быть числом'),
    productController.delete
);

module.exports = router;
