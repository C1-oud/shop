const Router = require('express');
const router = new Router();
const favoritesController = require('../controllers/favoritesController');

router.post('/', favoritesController.addFavorite);
router.delete('/:userId/:productId', favoritesController.removeFavorite);
router.get('/:userId', favoritesController.getFavorites);

module.exports = router;
