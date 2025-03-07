const { Basket, BasketProduct, Product } = require('../models/models');
const ApiError = require('../error/ApiError');
const { validationResult } = require('express-validator');

class BasketController {
    async getBasket(req, res) {
        const userId = req.user.id;
        const basket = await Basket.findOne({ where: { userId } });
        const basketProducts = await BasketProduct.findAll({
            where: { basketId: basket.id },
            include: [{ model: Product }]
        });

        const totalCost = basketProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        return res.json({ basketProducts, totalCost });
    }

    async addToBasket(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            basket = await Basket.create({ userId });
        }

        let basketProduct = await BasketProduct.findOne({ where: { basketId: basket.id, productId } });
        if (basketProduct) {
            basketProduct.quantity += quantity;
            await basketProduct.save();
        } else {
            await BasketProduct.create({ basketId: basket.id, productId, quantity });
        }

        return res.json({ message: 'Товар добавлен в корзину' });
    }

    async updateProductQuantity(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId, quantity } = req.body;
        const userId = req.user.id;

        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }

        const basketProduct = await BasketProduct.findOne({ where: { basketId: basket.id, productId } });
        if (!basketProduct) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        basketProduct.quantity = quantity;
        await basketProduct.save();

        return res.json({ message: 'Количество товара обновлено' });
    }

    async removeFromBasket(req, res) {
        const { productId } = req.params;
        const userId = req.user.id;

        const basket = await Basket.findOne({ where: { userId } });
        if (!basket) {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }

        await BasketProduct.destroy({ where: { basketId: basket.id, productId } });

        return res.json({ message: 'Товар удален из корзины' });
    }
}

module.exports = new BasketController();
