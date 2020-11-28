const userRoutes = require('express').Router();
const middleUser = require('../middlewares/user');
const middleAdmin = require('../middlewares/admin');
const middleToken = require('../middlewares/verifyToken');
const controller = require('../controllers/user');



// enregistrer de l'utilisateur
userRoutes.post('/inscription', [middleUser.checkDuplicateData, middleUser.verifyPostData], controller.inscription)

// Connexion de l'utilisateur
userRoutes.post('/connexion', middleUser.verifyLoginData, controller.connexion)

// envoie d'email pour la renitialisation du mot de passe de l'utilisateur
userRoutes.post('/forgot', middleUser.emailForgotPassword, controller.forgotPassword)

//renitialiser le mot de passe de l'utilisateur
userRoutes.post('/reset', [middleToken.verifyToken, middleUser.verifynewPassword], controller.resetPassword)

// Récuper les informations de l'utilisateur courant
userRoutes.get('/profile', middleToken.verifyToken, controller.findOneUser)

// Récupérer les informations de tout les utilisateurs
userRoutes.get('/admin', [middleToken.verifyToken, middleAdmin.RoleAdmin], controller.findAllUsers)

// Déconnecter l'utilisateur
userRoutes.get('/logout', controller.LogoutUser)

module.exports = userRoutes;