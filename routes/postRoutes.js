const express = require('express');
const router = express.Router();

const controller = '../controllers/puts';
const middleWare = '../middleware';

const testV = require(`${middleWare}/test`);

const signUpController = require(`${controller}/signUp`);
router.put('/sign_up', signUpController.createNewUser);

const logInController = require(`${controller}/logIn`);
router.put('/log_in', logInController.fetchUserAccount);

const test = require(`${controller}/test`);
router.put('/test', testV, test.output);


module.exports = router;