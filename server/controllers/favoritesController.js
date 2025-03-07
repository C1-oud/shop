const { Favorite, Product } = require('../models/models.js');

class FavoritesController {
    async addFavorite(req, res) {
        const { userId, productId } = req.body;
        const favorite = await Favorite.create({ userId, productId });
        return res.json(favorite);
    }

    async removeFavorite(req, res) {
        const { userId, productId } = req.params;
        const favorite = await Favorite.destroy({ where: { userId, productId } });
        return res.json({ message: "Removed from favorites" });
    }

    async getFavorites(req, res) {
        const { userId } = req.params;
        const favorites = await Favorite.findAll({ where: { userId }, include: [Product] });
        return res.json(favorites);
    }
}

module.exports = new FavoritesController();
