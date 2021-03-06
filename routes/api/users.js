const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');

// User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public (don't need token, would need if Private)
router.post(
    '/', 
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({ min: 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, user_type } = req.body;

        try {

        let user = await User.findOne({ email });

        // See if user exists
        if(user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already exists' }] });
        }

        // Get users gravatar
        const avatar = normalize(
            gravatar.url(email, {
                s: '200', // Default size
                r: 'pg', // Rating of pg (no naked people!)
                d: 'mm' // Gives default image user icon
            }),
            { forceHttps: true }
        );

        user = new User({
            name,
            email,
            password,
            user_type,
            avatar
        });

        // Encrypt password using bcrypt
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: '5 days' },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );

        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;