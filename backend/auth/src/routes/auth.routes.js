const express = require('express')
const { registerUser, loginUser, resetPassword, logoutUser, GetAddress,addAddress, deleteAddress } = require('../controller/auth.controller')
const validator = require('../middleware/validator.middleware');
const { authUser } = require('../middleware/auth.middleware');

const router = express.Router()

router.post('/register',validator.registerValidationRules, validator.responseWithErrors, registerUser);
router.post('/login',  loginUser);
router.post('/reset-password',resetPassword);
router.post('/logout', logoutUser);
router.get('/user/me/address',authUser,GetAddress)
router.post('/user/me/address',authUser,addAddress)
router.delete('/user/me/address/:id',authUser,deleteAddress)

module.exports = router;