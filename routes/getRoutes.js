const express = require('express');
const router = express.Router();

const controller = '../controllers/gets';

// middle ware //
const isAuth = require('../middleware/isAuth');
const isRefresh = require('../middleware/isRefresh');
//===========//

const signUpController = require(`${controller}/logOut`);
router.get('/log_out', isAuth, signUpController.logOutUser);

const refreshTokenController = require(`${controller}/refreshToken`);
router.get('/refresh', isRefresh, refreshTokenController.refresh);





module.exports = router;