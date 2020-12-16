const multer = require('multer');
const path   = require('path');
const fs = require('fs');
const File = require('../models/file');


// Upload d'un file
module.exports.upload = (req, res) => {

    let file = new File({
        filename: req.body.filename,
    });
    file.save()
        .then(file => {
            res.json({
                message: "File ajouté avec succès..."
            })
        })
        .catch(err => {
            res.json({
                message: "Une erreur rencontrée..."
            });
        });
}

module.exports.findOneFile = async(req, res) => {
    try {
        File.findById(req.file.id, {}, (err, file) => {
            if (err) return res.status(500).send("There was a problem finding the file.");
            if (!file) return res.status(404).send("No file found.");
            res.status(200).send(file)
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}