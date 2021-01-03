const multer = require('multer');
const path   = require('path');
const fs = require('fs');
const File = require('../models/file');
var dir = "./uploads"


// Upload d'un file // marche pa
module.exports.upload2 = (req, res) => {

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
        callback(null, path.basename(file.originalname, path.extname(file.originalname)) 
        + "_" + Date.now() + path.extname(file.originalname)); // nom_2020.pdf
    }
  });

module.exports.upload = function(req,res){
    var partial = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            var tab = ['.pptx','.docx','.pdf','.png','.html','.css','.js','.php','.sql','.json','.xml']
            //if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.pdf') {
            if (tab.indexOf(ext) <= -1) {
                //return callback(new Error('This file format is not supported'))
                return res.status(501).send('This file format is not supported')
            }
            callback(null, true)
        }
    }).single('filename');
      partial(req,res,function(err) {
          if(err) {
              return res.status(500).send("Error uploading file.");
          }
          res.status(200).send("File is uploaded in the app");
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