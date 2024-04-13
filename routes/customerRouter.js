const express = require("express");
customerController=require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter.post('/profile',customerController.displayProfileData);

customerRouter.post('/post', customerController.postRequest);

customerRouter .post('/details', customerController.getAcceptedWorkerDetails);

customerRouter .post('/cancel', customerController.cancelPostRequest);

module.exports = customerRouter ;