const express = require('express');
const moment = require('moment');
const { User, validate } = require('../models/User');

const router = express.Router();


router.get('/', (req, res) => {
    User.find({})
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(400).send(err);
        })
})

router.get('/profile/:token', async(req, res) => {
    const token = req.params.token
    await User.findByToken(token, (err, user) => {
        if (err) return res.status(400).json({
            success: false,
            message: err,
        })
        return res.status(200).json({
            success: true,
            user,
        })
    });
});

router.post('/register', async(req, res) => {

    const { error } = validate(req.body)
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }

    let checkUserEmail = await User.findOne({ email: req.body.email })


    if (checkUserEmail) return res.status(400).json({
        success: false,
        message: `User with email ${req.body.email} already exists`,
    })

    let checkUsername = await User.findOne({ username: req.body.username })


    if (checkUsername) return res.status(400).json({
        success: false,
        message: `User with username ${req.body.username} already exists`,
    })

    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })

    await user.save((err, user) => {
        if (err) return res.status(500).json({ success: false, message: err })
        else {
            return res.status(200).json({ success: true, user, message: 'User saved successfully!' })
        }
    })
})

module.exports = router;