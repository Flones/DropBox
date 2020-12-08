const File = require('../models/file');

// Suppression d'un file
module.exports.upload = (req, res) => {
    //crypter le mot de passe du file

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
        File.findById(req.file.id, { password: 0 }, (err, file) => {
            if (err) return res.status(500).send("There was a problem finding the file.");
            if (!file) return res.status(404).send("No file found.");
            res.status(200).send(file)
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}