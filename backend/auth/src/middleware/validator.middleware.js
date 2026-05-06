const { body, validationResult } = require('express-validator');

const responseWithErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log('Validation errors found:', errors.array());
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    }
   console.log('Validation passed, proceeding to the next middleware/controller');
    next();
};

const registerValidationRules = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),

    body('fullName.firstname')
        .notEmpty()
        .withMessage('First name is required'),

    body('fullName.lastname')
        .notEmpty()
        .withMessage('Last name is required'),

    body('role')
        .optional()
        .isIn(['user', 'seller', 'admin'])
        .withMessage('Role must be either user, seller or admin'),
        responseWithErrors
];

module.exports = {
    responseWithErrors  ,
    registerValidationRules   
};