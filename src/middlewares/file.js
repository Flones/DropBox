const File = require('../models/file');


// vérifier que tous les champs sont renseignés
module.exports.verifyPostData = async(req, res, next) => {
    if (!req.body.filename)
        return res.status(401).send({ message: 'Aucun filename fourni' });
    next();
};
module.exports.checkDuplicateData = async(req, res, next) => {
    //Filename
    File.findOne({
        filename: req.body.filename
    }).exec((err, file) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (file) {
            res.status(400).send({ message: "filename déjà utilisé..." });
            return;
        }
        next();
    });
};