const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, basketController.getBasket);

router.post(
    '/add',
    authMiddleware,
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    basketController.addToBasket
);

router.put(
    '/update',
    authMiddleware,
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    basketController.updateProductQuantity
);

router.delete('/remove/:productId', authMiddleware, param('productId').isInt().withMessage('Product ID must be an integer'), basketController.removeFromBasket);

module.exports = router;
