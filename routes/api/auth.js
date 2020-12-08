const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public (don't need token, would need if Private)
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;