const express = require('express')
const { registerUser, loginUser, resetPassword } = require('../controller/auth.controller')
const validator = require('../middleware/validator.middleware')

const router = express.Router()

router.post('/register',validator.registerValidationRules, validator.responseWithErrors, registerUser);
router.post('/login',  loginUser);
router.post('/reset-password',resetPassword);

module.exports = router;