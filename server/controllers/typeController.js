const { Type } = require('../models/models.js');
const ApiError = require('../error/ApiError.js');
const cache = require('../cache.js');

const CACHE_KEY = 'types';
const CACHE_TTL = 60;

const TypeController = {
    getAll: async (req, res, next) => {
        try {
            const cachedTypes = await cache.get(CACHE_KEY);

            if (cachedTypes) {
                return res.json(JSON.parse(cachedTypes));
            }

            const types = await Type.findAll();

            await cache.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(types));

            return res.json(types);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    },

    create: async (req, res, next) => {
        try {
            const { name } = req.body;
            const type = await Type.create({ name });

            await cache.del(CACHE_KEY);

            return res.json(type);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
};

module.exports = TypeController;
