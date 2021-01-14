const PostRoutes = require('express').Router();
const middleFile = require('../middlewares/posts');
const middleAdmin = require('../middlewares/admin');
const middleToken = require('../middlewares/verifyToken');
const controller = require('../controllers/posts');

// enregistrement du file
//PostRoutes.get('/toto', controller.getPost)
//PostRoutes.post('/toto', controller.getPost)

module.exports = PostRoutes;