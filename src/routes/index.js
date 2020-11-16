const userRoutes = require('./userRoutes'),
      routes = require('express').Router();

// inscription, connexion 
routes.use('/user', userRoutes);

module.exports = routes;