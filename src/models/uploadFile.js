const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const uploadfileShema = new Schema({
    //l'identifiant de l'utilisateur ayant uploder le fichier
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    files: [String]

}, { timestamps: true });

uploadfileShema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

const Files = mongoose.model('Files', uploadfileShema);
module.exports = Files;