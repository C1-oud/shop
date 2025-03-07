const Router = require('express').Router;  
const router = new Router();

const productRouter = require('./productRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const favoritesRouter = require('./favoritesRoutes');  


router.use('/', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/product', productRouter);
router.use('/basket', basketRouter);
router.use('/favorite', favoritesRouter); 

module.exports = router;
