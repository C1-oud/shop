const { check, validationResult } = require('express-validator');

const validateProductMiddleware = [
  check('name')
    .notEmpty().withMessage('Название продукта не может быть пустым')
    .isLength({ max: 255 }).withMessage('Название продукта не может быть длиннее 255 символов'),
  
  check('price')
    .isNumeric().withMessage('Цена должна быть числом')
    .custom(value => value > 0).withMessage('Цена должна быть больше нуля'),
  
  check('brandId')
    .notEmpty().withMessage('Необходимо указать бренд продукта'),
  
  check('typeId')
    .notEmpty().withMessage('Необходимо указать тип продукта'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProductMiddleware;
