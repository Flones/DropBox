const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      swaggerJsDoc = require('swagger-jsdoc'),
      swaggerUI = require('swagger-ui-express');

global.db = require('./src/models/index');

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

// Route par defaut
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});




app.listen(port, () => console.log(`listening on http://localhost:${port}`));