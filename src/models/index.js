const mongoose = require('mongoose');
const dbconnexion = require('../../env');
mongoose.connect(dbconnexion.online, { //local or online
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDb is running');
})

module.exports = mongoose;