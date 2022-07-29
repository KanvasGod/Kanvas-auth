const express = require('express');
const router = express.Router();

const controller = '../controllers/puts';

const signUpController = require(`${controller}/signUp`);

router.put('/sign_up', signUpController.createNewUser);

module.exports = router;