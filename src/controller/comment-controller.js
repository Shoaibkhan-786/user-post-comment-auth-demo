const commentmodel = require("../model/commentmodel");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.createComment = async (req, res, next) => {
    try {
        const { user } = req.session;
        const { comment, postid } = req.body;

        const schema = Joi.object({
            comment: Joi.string().min(3).max(50).required()
        })

        let result = schema.validate(comment);

        if (result.error) {
            return res.redirect('/allpost');
        }
        await commentmodel.create({ commentBy: user, commentOn: postid, comment });
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}


exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await commentmodel.findByIdAndUpdate(id, { isDeleted: true });
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}

exports.editComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await commentmodel.findById(id);
        res.render('pages/editcomment', {
            comments: comment,
            error: ""
        });
    } catch (error) {
        next(error)
    }
}


exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const Schema = Joi.object({
            comment: Joi.string().min(2).max(50).required
        })

        const result = Schema.validate(comment);
        if (result.error) {
            res.render('pages/editcomment', {
                error: 'comment is greater than 2 and less than 50',
                comments: { _id: id, comment }
            })
        }

        await commentmodel.findByIdAndUpdate(id, { comment });
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}