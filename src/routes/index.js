const userRoutes = require('./userRoutes'),
      routes = require('express').Router();

// inscription 
routes.use('/user', userRoutes);

module.exports = routes;