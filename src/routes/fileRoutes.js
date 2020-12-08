const fileRoutes = require('express').Router();
const middleFile = require('../middlewares/file');
const middleAdmin = require('../middlewares/admin');
const middleToken = require('../middlewares/verifyToken');
const controller = require('../controllers/file');

// enregistrement du file
fileRoutes.post('/upload',[middleFile.checkDuplicateData, middleFile.verifyPostData], controller.upload) //[middleToken.verifyToken, middleAdmin.RoleAdmin],

module.exports = fileRoutes;