const mongoose = require('mongoose'),
      Schema  = mongoose.Schema;

const userShema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    isActive: Boolean,
    
}, { timestamps: true });

const  User = mongoose.model('User', userShema);
module.exports = User;