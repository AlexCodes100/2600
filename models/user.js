const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'member'
    },
    since: {
        type: Date,
        default: Date.now
    }
}, { collection: 'members' }); // Specify the collection name here

module.exports = mongoose.model('User', UserSchema);