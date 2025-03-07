const ApiError = require('../error/ApiError');
const logger = require('../logger');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        logger.error(`API Error: ${err.status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(err.status).json({ message: err.message });
    }
    logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(500).json({ message: "Непредвиденная ошибка" });
};
