const express = require('express')
const { registerUser } = require('../controller/auth.controller')
const validator = require('../middleware/validator.middleware')

const router = express.Router()

router.post('/register',validator.registerValidationRules, validator.responseWithErrors, registerUser);

module.exports = router;