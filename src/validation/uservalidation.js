const Joi = require('joi');

exports.signup = {
    body: Joi.object({
        username: Joi.string().min(3).max(20).trim().required(),
        email: Joi.string().min(3).max(15).trim().required().lowercase().email(),
        password: Joi.string().min(4).max(10).trim().required(),

    })
}

exports.login = {
    body: Joi.object({
        email: Joi.string().min(3).max(15).trim().required().lowercase().email(),
        password: Joi.string().min(4).max(10).trim().required()
    })
}