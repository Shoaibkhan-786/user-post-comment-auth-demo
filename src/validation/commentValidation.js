const Joi  = require('joi');



// exports.addComment = {
//     body : Joi.object({
//         comment : Joi.string().min(3).max(50).required().trim() ,
//         postid: Joi.objectId()
//     })
// }

exports.updateComment = {
   
    body : Joi.object({
        comment : Joi.string().min(3).max(50).trim() 
    }).required()
}

