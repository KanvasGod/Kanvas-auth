const express = require('express');
const router = express.Router();

const controller = '../controllers/gets';

// middle ware //
const isAuth = require('../middleware/isAuth');
//===========//

const signUpController = require(`${controller}/logOut`);
router.put('/log_out', isAuth, signUpController.logOutUser);





module.exports = router;