const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {  // Synchronized with Keycloak or can be omitted if not needed.
        type: String,
        required: true,
        unique: true
    },
    userName: String,  // Synchronized with Keycloak or can be omitted if not needed.
    salt:String,
    password:String,
    profileImage: String,
    userRole:String,
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data'
    }],
    likedNews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'news'
    }]
});

module.exports = mongoose.model('user_data', userSchema);
