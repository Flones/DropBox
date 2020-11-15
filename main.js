const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cors = require("cors"),
      route = require('./src/routes'),
      swaggerJsDoc = require('swagger-jsdoc'),
      swaggerUI = require('swagger-ui-express');
      
global.db = require('./src/models');

      

//swagger configuration
const port = process.env.PORT || 3000;
const www = process.env.WWW || './public';
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title : "Swagger api",
            description: "listes des routes et documentations",
            servers: [`http://localhost:${port}`]
        }
    },
    apis: ["main.js"]
};

//Documentation with Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

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