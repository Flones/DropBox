const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Nom du fichier..."]
    },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;