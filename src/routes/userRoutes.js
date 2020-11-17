const userRoutes = require('express').Router();
const middlewares = require('../middelwares/user');
const controller = require('../controllers/user');


// enregistrer de l'utilisateur
userRoutes.post('/inscription', [middlewares.checkDuplicateData, middlewares.verifyPostData], controller.inscription)

// Connexion de l'utilisateur
userRoutes.post('/connexion', middlewares.verifyLoginData, controller.connexion )

module.exports = userRoutes;