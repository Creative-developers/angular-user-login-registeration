const Joi = require('joi')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const express = require('express')
const moment = require('moment')
const { User } = require('../models/User')

const router = express.Router();

router.post('/', async(req, res) => {

    const { error } = validate(req.body)
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message })
    }

    /**
     * Check if user exists
     */

    let checkUser = await User.findOne({
        $or: [{ email: req.body.username }, { username: req.body.username }]
    });

    if (!checkUser) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect login details'
        })
    }

    /**
     * Check Password
     */


    const checkPass = await bcrypt.compare(req.body.password, checkUser.password)
    if (!checkPass) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect login details'
        })
    }

    const token = jwt.sign(checkUser._id.toHexString(), config.get('privateKey'));
    //set response headers
    res.header('x-auth-token', token).header('access-control-expose-headers', 'x-auth-token');
    return res.status(200).json({ token })

})


function validate(user) {
    const schema = Joi.object({
        username: Joi.string().min(4).required().messages({
            'string.base': `username or email address must be a string`,
            'string.empty': `username or email address is required`,
            'string.min': `username or email address must be at least 4 characters`,
            'any.required': `username or email address is required`
        }),
        password: Joi.string().min(4).required(),
    })
    return schema.validate(user);
}

module.exports = router