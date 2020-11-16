const mongoose = require('mongoose'),
      Schema  = mongoose.Schema;

const userShema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Nom d'utilisateur..."]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required : [true, "Adresse email..."]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Mot de passe..."]
    },
    isActive: Boolean,
    
}, { timestamps: true });

const  User = mongoose.model('User', userShema);
module.exports = User;