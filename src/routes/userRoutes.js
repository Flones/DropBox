const userRoutes = require('express').Router();
const middlewares = require('../middelwares/user');
const controller = require('../controllers/user');


// enregistrer un utilisateur
userRoutes.post('/inscription', [middlewares.checkDuplicateData, middlewares.verifyPostData], controller.inscription)

module.exports = userRoutes;