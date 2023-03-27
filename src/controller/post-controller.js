const commentmodel = require("../model/commentmodel");
const postmodel = require("../model/postmodel");
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.createPost = async (req, res, next) => {
    res.render('pages/newpost', {
        error: ""
    });
}

exports.createPostProcess = async (req, res, next) => {
    try {
        const { user } = req.session;
        const { title, description } = req.body;

        const schema = Joi.object({
            title: Joi.string().min(3).max(50).required(),
            description: Joi.string().min(3).max(500).required()
        })

        let result = schema.validate(req.body);

        if (result.error) {
            res.render('pages/newpost', {
                error: result.error.details[0].message
            });
        }

        await postmodel.create({ postBy: user, title, description });
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}

exports.fetchAllPost = async (req, res, next) => {
    try {
        const findPosts = postmodel.find({ isDeleted: false }).sort({ _id: -1 });
        const findComments = await commentmodel.find({ isDeleted: false });

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page-1) * limit;

        const count = await postmodel.countDocuments({isDeleted: false});
        const posts = await findPosts.skip(skip).limit(limit);
        
        res.render('pages/allpost', {
            posts,
            comments: findComments,
            currentPage: page,
            totalPage: Math.ceil(count/limit)
        })
    } catch (error) {
        next(error)
    }
}


exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        await postmodel.findByIdAndUpdate(id, { isDeleted: true });
        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}

exports.editPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postmodel.findById(id, { isDeleted: false });

        res.render('pages/editpost', {
            error: "",
            posts: post
        });
    } catch (error) {
        next(error)
    }
}


exports.updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const schema = Joi.object({
            title: Joi.string().min(3).max(50).required(),
            description: Joi.string().min(3).max(500).required()
        })

        let result = schema.validate(req.body);

        if (result.error) {
            res.render('pages/editpost', {
                error: result.error.details[0].message,
                posts: { _id: id, title, description }
            });
        }

        await postmodel.findByIdAndUpdate(id, { title, description });

        res.redirect('/allpost');
    } catch (error) {
        next(error)
    }
}