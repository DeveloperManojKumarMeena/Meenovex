const { body, validationResult } = require('express-validator');

const responseWithErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log('Validation errors found:', errors.array());
        return res.status(400).json({ errors: errors.array() });

    }
   console.log('Validation passed, proceeding to the next middleware/controller');
    next();
};

const registerValidationRules = [
    body('email')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),

    body('role')
        .optional()
        .isIn(['user', 'seller'])
        .withMessage('Role must be either user or seller'),
        responseWithErrors
];

module.exports = {
    responseWithErrors  ,
    registerValidationRules   
};