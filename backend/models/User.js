const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const Joi = require('joi')


var saltRounds = 10;

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastName: {
        type: String,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        minlength: 4,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


/**
 * Validate user input fields
 */

function validate(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3),
        email: Joi.string().min(5).required().email(),
        username: Joi.string().min(4).required(),
        password: Joi.string().min(4).required(),
    })
    return schema.validate(user);
}
/**
 * Hash the password before saving
 */

UserSchema.pre('save', function(next) {
    var user = this

    // Hash the password before saving the user model

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err)
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})


/**
 * Compare password in login and password in db
 */

UserSchema.methods.comparePassword = function(password, callback) {
    var user = this
    bcrypt.compare(password, user.passwrod, (err, isMatch) => {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

/**
 * Generate JWT Token for user
 */
function generateToken(user, callback) {
    var user = this
    var token = jwt.sign(user._id.toHexString(), config.get('privateKey'))
    var oneHour = moment().add(1, 'hour').valueOf()

    user.tokenExp = oneHour;
    user.token = token;

    return user;
}

/**
 *find user by token
 */

UserSchema.statics.findByToken = function(token, callback) {
    var user = this;
    jwt.verify(token, config.get('privateKey'), function(err, decode) {
        User.findOne({ "_id": decode }, function(err, user) {
            if (err) return callback(err);
            callback(null, user);
        })
    })
}

const User = mongoose.model('User', UserSchema);
module.exports = { User, validate }