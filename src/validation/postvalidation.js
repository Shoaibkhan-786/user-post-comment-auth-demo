const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.createPost = {
    body: Joi.object({
        title: Joi.string().min(3).max(50).required().trim(),
        description: Joi.string().min(3).max(50).required().trim()
    })
}

exports.updatePost = {
    body: Joi.object({
        title: Joi.string().min(3).max(50).required().trim(),
        description: Joi.string().min(3).max(50).required().trim()
    })
}


