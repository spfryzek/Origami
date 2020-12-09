const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    course_id: {
        type: Number,
        required: true,
        unique: true
    },
    course_name: {
        type: String,
        required: true
    },
    course_level: {
        type: String,
        required: true
    },
    course_description: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Course = mongoose.model('course', CourseSchema);