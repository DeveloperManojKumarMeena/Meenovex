const { body } = require('express-validator');

const createProductValidators = [
  body('title').exists().withMessage('Title is required').isString().isLength({ min: 3 }).withMessage('Title too short'),
  body('description').exists().withMessage('Description is required').isString().isLength({ min: 10 }).withMessage('Description too short'),
  body('price.amount').exists().withMessage('Price amount is required').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0').toFloat(),
  body('price.currency').exists().withMessage('Currency is required').isIn(['USD', 'INR']).withMessage('Currency must be USD or INR'),
  body('category').exists().withMessage('Category is required').isString().withMessage('Category must be a string'),
];

module.exports = {
  createProductValidators,
};
