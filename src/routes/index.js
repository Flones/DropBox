const filesRoutes = require('./fileRoutes');
const userRoutes = require('./userRoutes');
const routes = require('express').Router();

// inscription, connexion, profileUser, AllUsers
routes.use('/user', userRoutes);

// uploader des fichiers
routes.use('/files', filesRoutes);


module.exports = routes;