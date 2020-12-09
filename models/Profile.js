const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    interests: {
        type: String
    },
    available: {
        type: Boolean,
        default: true,
        required: true
    },
    inappropriate_activity: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);