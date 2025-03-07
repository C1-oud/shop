const { Brand } = require('../models/models.js');
const ApiError = require('../error/ApiError.js');
const cache = require('../cache.js');

const CACHE_KEY = 'brands';
const CACHE_TTL = 60;

const BrandController = {
    getAll: async (req, res, next) => {
        try {
            const cachedBrands = await cache.get(CACHE_KEY);

            if (cachedBrands) {
                return res.json(JSON.parse(cachedBrands));
            }

            const brands = await Brand.findAll();

            await cache.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(brands));

            return res.json(brands);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },

    create: async (req, res, next) => {
        try {
            const { name } = req.body;
            const brand = await Brand.create({ name });

            await cache.del(CACHE_KEY);

            return res.json(brand);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
};

module.exports = BrandController;
