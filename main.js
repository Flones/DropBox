const express = require('express'),
      app = express();
      global.db = require('./src/models/index');

const port = process.env.PORT || 3000;
const www = process.env.WWW || './public';

// Middelware
app.use(express.static(www));

// Route par defaut
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));