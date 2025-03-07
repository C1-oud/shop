require('dotenv').config()
const express = require ('express')
const morgan = require('morgan');
const logger = require('./logger');
const sequelize = require('./db')
const models = require ('./models/models')
const cors = require ('cors')
const fileUpload = require ('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const favoritesRouter = require('./routes/favoritesRoutes');

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));
app.use(errorHandler)
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).send('Something broke!');
});
app.use('/api/favorites', favoritesRouter);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()