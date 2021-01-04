const { file } = require('googleapis/build/src/apis/file');
const User = require('./user');

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fileSchema = new Schema({
    path: {
        type: String,
        required: [true, "Path du fichier..."]
    },
    caption: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;