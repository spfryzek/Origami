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
        default: true
    },
    inappropriate_activity: {
        type: Number,
        default: 0
    },
    course_history: [
        {   
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            course_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'course'
            },
            date_enrolled: {
                type: Date,
                required: true
            },
            date_completed: {
                type: Date
            }   
        }
    ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);