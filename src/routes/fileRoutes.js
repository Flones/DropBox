const filesRoutes = require('express').Router();
const middleToken = require('../middlewares/verifyToken');
const middleFiles = require('../middlewares/uploadFile');
const controller = require('../controllers/uploadFile');
const fs = require('fs');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let dirCandidate = './uploads/'
        fs.mkdirSync(dirCandidate);
        cb(null, 'dirCandidate')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ dest: './uploads/', inMemory: true, storage: storage });
// var upload = multer({ storage: storage });


// Upload des fichiers
//, [middleToken.verifyToken, middleFiles.middelFiles]
filesRoutes.post('/upload', middleFiles.middelFiles, upload.single('files'), controller.uploadFiles)

module.exports = filesRoutes;