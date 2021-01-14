const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require("cors"),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    dbconnexion = require('./env'),
    route = require('./src/routes');
const crypto = require("crypto");
const router = express.Router();
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

// DB
const mongoURI = dbconnexion.LOCAL;


// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);
        });
      });
    }
});

  app.get("/", (req, res) => {
    res.render("test")
   })


  const obj =(req,res) => {
    console.log("next")
    upload(req, res, () => {
       console.log("Request ---", req.body);
       console.log("Request file ---", req.file);//Here you get file.
       const file = new File();
       file.meta_data = req.file;
       file.save().then(()=>{
       res.send({message:"uploaded successfully"})
       })
       /*Now do where ever you want to do*/
    });
 }
 
 app.post("/upupup", obj);

  app.get("/image/:filename", (req, res) => {
    // console.log('id', req.params.id)
    const file = gfs
      .find({
        filename: req.params.filename
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist"
          });
        }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
  });

// files/del/:id
// Delete chunks from the db
app.post("/files/del/:id", (req, res) => {
    gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
      if (err) return res.status(404).json({ err: err.message });
      res.redirect("/");
    });
  });

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
app.set("view engine", "ejs");

app.use(route); // charger nos différentes routes


// Route par defaut
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));