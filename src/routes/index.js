const userRoutes = require('./userRoutes'),
    fileRoutes = require('./fileRoutes'),
    routes = require('express').Router();

// inscription, connexion, profileUser, AllUsers
routes.use('/user', userRoutes);
routes.use('/file', fileRoutes);



module.exports = routes;