const express = require('express');
const router = express.Router();
const User = require('../models/user');

// register
router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success:false, msg: 'Failed to register the user'});
        } else {
            res.json({success:true, msg: 'Successfully registered the user', user: user});
        }
    });
});

module.exports = router;