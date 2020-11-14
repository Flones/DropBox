const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cors = require("cors"),
      route = require('./src/routes');
      
global.db = require('./src/models');

const port = process.env.PORT || 3000;
const www = process.env.WWW || './public';

// Middelware
app.use(express.static(www));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(route);// charger nos différentes routes
app.use( (req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

// Route par defaut
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));