const express = require('express');
const router = express.Router();

const controller = '../controllers/account';

// middle ware //
const isAuth = require('../middleware/isAuth');
//===========//

const updateUserNameController = require(`${controller}/changeUserName`);
router.put('/user_name', isAuth, updateUserNameController.update);


module.exports = router;