const express = require("express");
const workerController=require("../controllers/workerController");

const workerRouter = express.Router();

workerRouter.post('/scout',workerController.scout);
workerRouter.post('/accept', workerController.accept);
workerRouter.post('/upload', workerController.upload.single('file'),workerController.handleFileUpload);

module.exports = workerRouter;