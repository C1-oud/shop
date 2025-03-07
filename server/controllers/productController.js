// controllers/ProductController.js
const { Product, ProductInfo } = require('../models/models.js');
const ApiError = require('../error/ApiError.js');
const cache = require('../cache.js');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const CACHE_KEY = 'products';
const CACHE_TTL = 60;

const ProductController = {

    getAll: async (req, res, next) => {
        try {
            const cachedProducts = await cache.get(CACHE_KEY);

            if (cachedProducts) {
                return res.json(JSON.parse(cachedProducts));
            }

            const { brandId, typeId, limit = 9, page = 1 } = req.query;
            const offset = (page - 1) * limit;

            const whereClause = {};
            if (brandId) whereClause.brandId = brandId;
            if (typeId) whereClause.typeId = typeId;

            const products = await Product.findAll({ where: whereClause, limit, offset });

            await cache.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(products));

            return res.json(products);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await Product.findOne({
                where: { id },
                include: [{ model: ProductInfo, as: 'info' }],
            });

            if (!product) {
                return next(ApiError.notFound('Товар не найден'));
            }

            return res.json(product);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },

    create: async (req, res, next) => {
        try {
            const { name, price, brandId, typeId, info } = req.body;
            let fileName = null;

            if (req.file) {
                fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
                fs.renameSync(req.file.path, `static/${fileName}`);
            }

            const product = await Product.create({ name, price, brandId, typeId, img: fileName });

            if (info) {
                const parsedInfo = JSON.parse(info);
                await Promise.all(
                    parsedInfo.map(i =>
                        ProductInfo.create({
                            title: i.title,
                            description: i.description,
                            productId: product.id,
                        })
                    )
                );
            }

            await cache.del(CACHE_KEY);

            return res.json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, info } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return next(ApiError.notFound('Товар не найден'));
            }

            let fileName = product.img;
            if (req.file) {
                if (product.img) {
                    fs.unlinkSync(`static/${product.img}`);
                }
                fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
                fs.renameSync(req.file.path, `static/${fileName}`);
            }

            await product.update({ name, price, brandId, typeId, img: fileName });

            if (info) {
                await ProductInfo.destroy({ where: { productId: id } });

                const parsedInfo = JSON.parse(info);
                await Promise.all(
                    parsedInfo.map(i =>
                        ProductInfo.create({
                            title: i.title,
                            description: i.description,
                            productId: id,
                        })
                    )
                );
            }

            await cache.del(CACHE_KEY);

            return res.json(product);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) {
                return next(ApiError.notFound('Товар не найден'));
            }

            if (product.img) {
                fs.unlinkSync(`static/${product.img}`);
            }

            await product.destroy();

            await cache.del(CACHE_KEY);

            return res.json({ message: 'Товар удален' });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },
};

module.exports = ProductController;
