const fs = require('fs')

// Middelwares pour l'upload des fichiers
module.exports.middelFiles = async(req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send({ message: 'Aucun fichier selectionné' });
        const filesData = req.files.file
        console.log(filesData)
        next();
    } catch (err) {
        return res.status(500).send({ message: "un problème sur le serveur" });
    }
}