const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require("cors"),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    route = require('./src/routes');

global.db = require('./src/models');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("x-access-token, Origin, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

const port = process.env.PORT || 5000;
const www = process.env.WWW || './public';

// Middelware
app.use(express.static(www));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(route); // charger nos différentes routes

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      fs.opendir('./uploads', function(err) {
          if(err) {
              console.log(err.stack)
          } else {
              callback(null, './uploads');
          }
      })
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "___" + path.basename(file.originalname)/*  + path.extname(file.originalname) */);
    }
  });
  
  app.post('/file',function(req,res){
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            var auto = ["png","jpg","gif","jpeg","pdf",]
            if(auto.includes(ext)) {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        }
    }).single('userFile');
      upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          res.end("File is uploaded");
      });
  });


// Route par defaut
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));