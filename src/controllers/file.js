const multer = require('multer');
const path   = require('path');
const fs = require('fs');
const File = require('../models/file');
var dir = "./uploads"


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


const storage =   multer.diskStorage({
    destination: function (req, file, callback) {

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
      fs.opendir(dir, function(err) {
          if(err) {
              console.log(err.stack)
          } else {
              callback(null, dir);
          }
      })
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "___" + path.basename(file.originalname)/*  + path.extname(file.originalname) */);
    }
  });

module.exports.upload2 = function(req,res){
    var partial = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.pdf') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).single('filename');
      partial(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          res.end("File is uploaded");
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