const userRoutes = require('express').Router();
const middlewares = require('../middelwares/user');
const middelAdmin = require('../middelwares/admin');
const middelToken = require('../middelwares/verifyToken');
const controller = require('../controllers/user');



// enregistrer de l'utilisateur
userRoutes.post('/inscription', [middlewares.checkDuplicateData, middlewares.verifyPostData], controller.inscription)

// Connexion de l'utilisateur
userRoutes.post('/connexion', middlewares.verifyLoginData, controller.connexion)

// Récuper les informations de l'utilisateur courant
userRoutes.get('/profile', middelToken.verifyToken, controller.findOneUser)

// Récupérer les informations de tout les utilisateurs
userRoutes.get('/admin', [middelToken.verifyToken, middelAdmin.RoleAdmin], controller.findAllUsers)

module.exports = userRoutes;