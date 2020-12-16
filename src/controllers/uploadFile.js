const Files = require('../models/uploadFile')
const _ = require('underscore');


// module.exports.uploadFiles = (req, res) => {
//     let filesPath = _.map(req.files, (file) => { return file.originalname });
//     Files.findByIdAndUpdate({}, { $push: { filesData: { $each: filesPath } } }, { new: true },
//         function(err, myFile) {
//             res.send(myFile);
//         }
//     );
// }

// upload des fichiers

module.exports.uploadFiles = (req, res) => {

    let myfiles = new Files({
        filesData: req.files.filename
    });
    console.log(req.files)
    myfiles.save()
        .then(myfiles => {
            res.json({
                message: "Fichier uploadé avec succès..."
            })
        })
        .catch(err => {
            res.json({
                message: "Une erreur rencontrée..."
            });
        });
}