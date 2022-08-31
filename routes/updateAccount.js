const express = require('express');
const router = express.Router();

const controller = '../controllers/account';

// middle ware //
const isAuth = require('../middleware/isAuth');
const schema = require(`../middleware/schema/userNameSchema`);
//===========//

const updateUserNameController = require(`${controller}/changeUserName`);
router.put('/user_name', isAuth, schema, updateUserNameController.update);

const updatePhoneController = require(`${controller}/changePhone`);
router.put('/phone', isAuth, updatePhoneController.update);

const updateNameController = require(`${controller}/changeName`);
router.put('/name', isAuth, updateNameController.update);

const updateAddressController = require(`${controller}/changeAddress`);
router.put('/address', isAuth, updateAddressController.update);

const removeAddressController = require(`${controller}/removeAddress`);
router.put('/address_remove', isAuth, removeAddressController.update);

const fetchAccountController = require(`${controller}/fetchAccount`);
router.put('/fetch', isAuth, fetchAccountController.update);

module.exports = router;