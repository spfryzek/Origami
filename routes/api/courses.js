const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// Course model
const Course = require('../../models/Course');

// @route   POST api/courses
// @desc    Create or update course
// @access  Public
router.post(
    '/', 
    [
        auth,
        [   
            check('course_id', 'Course ID is required')
                .not()
                .isEmpty(),
            check('course_name', 'Course name is required')
                .not()
                .isEmpty(),
            check('course_level', 'Course level is required')
                .not()
                .isEmpty(),
            check('course_description', 'Course description is required')
                .not()
                .isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            course_id,
            course_name, 
            course_level, 
            course_description, 
            available 
        } = req.body;

        // Build course object
        const courseFields = {};
        //courseFields.user = req.user.id;

        if(course_id) {
          courseFields.course_id = course_id;  
        }

        if(course_name) {
          courseFields.course_name = course_name;  
        }

        if(course_level) {
          courseFields.course_level = course_level;  
        }

        if(course_description) {
          courseFields.course_description = course_description;  
        }

        if(available) {
          courseFields.available = available;  
        }

        try {

            let course = await Course.findOne({ course_id });

            if(course) {
                //Update course if found
                course = await Course.findOneAndUpdate(
                    { course_id: course_id },
                    { $set: courseFields },
                    { new: true }
                );

                return res.json(course);
            }

            // Create course
            course = new Course(courseFields);
            await course.save();
            res.json(course);

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/courses
// @desc    Get all courses
// @access  Private
router.get('/', auth, async (req, res) => {
    try{
        const course = await Course.find();
        // const course = await Course.find().sort({ date: -1 });
        res.json(course);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// // @route   DELETE api/courses
// // @desc    Delete courses
// // @access  Public
// router.delete('/', async (req, res) => {
//     try {
//         // Remove course
//         // await Course.findOneAndRemove({ course_id: course_id });

//         // res.json({ msg: 'Course deleted from system' });
//     } catch(err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

module.exports = router;