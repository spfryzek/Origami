const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile')
const User = require('../../models/User')
// const Course = require('../../models/Course');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('available', 'User availability is required')
                .not()
                .isEmpty(),
            check('inappropriate_activity', 'Inappropriate activity is required')
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
            interests,
            available,
            inappropriate_activity
        } = req.body;

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;

        if(interests) {
          profileFields.interests = interests;  
        }

        if(available) {
          profileFields.available = available;  
        }

        if(inappropriate_activity) {
          profileFields.inappropriate_activity = inappropriate_activity;  
        }

        try{
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                //Update profile if found
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }

            //Create profile
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if(!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user, and comments
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // @TODO - remove users comments

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted from system' });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// // @route   PUT api/profile/coursehistory
// // @desc    Add course history
// // @access  Private
// router.put('/coursehistory',
//     [
//         auth,
//         [
//             check('date_enrolled', 'Date enrolled is required')
//                 .not()
//                 .isEmpty(),
//         ]
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         //const course = await Course.findById(req.course.id);

//         const {
//             course_id,
//             date_enrolled,
//             date_completed
//         } = req.body;

//         const newHistory = {
//             course_id: req.body.course_id,
//             date_enrolled: req.body.date_enrolled,
//             date_completed: req.body.date_completed
//         }

//         try {
//             //const user = await User.findById(req.params.id);
//             const profile = await Profile.findById({course_id});
//             profile.course_history.unshift(newHistory);
//             res.json(profile);
//         } catch(err) {
//             console.error(err.message);
//             res.status(500).send('Server Error');
//         }        
//     }
// );

module.exports = router;