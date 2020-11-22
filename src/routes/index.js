const userRoutes = require('./userRoutes'),
    routes = require('express').Router();

// inscription, connexion, profileUser, AllUsers
routes.use('/user', userRoutes);



module.exports = routes;