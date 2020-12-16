const filesRoutes = require('express').Router();
const middleToken = require('../middlewares/verifyToken');
const middleFiles = require('../middlewares/uploadFile');
const controller = require('../controllers/uploadFile');
const fs = require('fs-extra');
const multer = require('multer');


const BASE_DIR = './uploads/';
// lieu de stockage des fichiers
const storage = multer.diskStorage({
    // file destination
    destination: (req, file, cb) => {
        let stockagedata = BASE_DIR + '/';
        fs.ensureDirSync(stockagedata);
        cb(null, stockagedata)
    },
    // rename file
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


// Upload des fichiers
//, [middleToken.verifyToken, middleFiles.middelFiles]
filesRoutes.post('/upload', upload.array("files"), controller.uploadFiles);

module.exports = filesRoutes;