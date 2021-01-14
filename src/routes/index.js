const userRoutes = require('./userRoutes'),
    fileRoutes = require('./fileRoutes'),
    postRoutes = require('./postRoutes'),
    routes = require('express').Router();

// inscription, connexion, profileUser, AllUsers
routes.use('/user', userRoutes);
routes.use('/file', fileRoutes);
routes.use('/post', postRoutes);



module.exports = routes;