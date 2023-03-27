const userModel = require('../model/usermodel');
const postModel = require('../model/postmodel');
const bcrypt = require('bcrypt');
const commentmodel = require('../model/commentmodel');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.homePage = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.session.user).lean();
        if (user) {
            res.render("pages/home", {
                username: user.username,
                isLoggedIn: true
            })
        } else {
            res.redirect('/login');
        }

    } catch (error) {
        next(error)
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const userid = req.session.user;
        const user = await userModel.findById(userid, { isDeleted: false }).lean();
        const userPost = await postModel.find({ postBy: userid, isDeleted: false });
        if (userPost == null) {
            res.render('pages/profile', {
                error: "",
                user,
                posts: "null"
            })
        } else {
            res.render('pages/profile', {
                error: "",
                user,
                posts: userPost
            })
        }

    } catch (error) {
        next(error)
    }
}


exports.updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id, { isDeleted: false }).lean();
        res.render('pages/profileupdate', {
            error: "",
            user
        });
    } catch (error) {
        next(error)
    }
}

exports.updateProfileProcess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const schema = Joi.object({
            username: Joi.string().min(3).max(20).trim().required(),
            email: Joi.string().min(3).trim().required().lowercase().email(),
        })

        let result = schema.validate(req.body);

        if (result.error) {
            return res.render('pages/profileupdate', {
                error: result.error.details[0].message,
                user: { _id: id, username, email }
            });
        }

        const isExistingEmail = await userModel.find({email});
        if(isExistingEmail) {
            return res.render('pages/profileupdate', {
                error: "enter only your email",
                user: { _id: id, username, email }
            });
        }

        await userModel.findByIdAndUpdate(id, { username, email });
        res.redirect('/profile');
    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.render('pages/resetpassword', {
        error: "",
        user
    });
}


exports.resetPasswordProcess = async (req, res, next) => {
    try {
        const userid = req.session.user;
        const { oldpassword, newpassword } = req.body;

        const schema = Joi.object({
            oldpassword: Joi.string().min(3).max(8).trim().required(),
            newpassword: Joi.string().min(3).max(8).trim().required()
        })

        let result = schema.validate(req.body);
        
        if (result.error) {
            return res.render('pages/resetpassword', {
                error: result.error.details[0].message,
                user: {_id: userid}
            });
        }

        const user = await userModel.findById(userid);

        const comparePassword = await bcrypt.compare(oldpassword, user.password);
        if (comparePassword) {
            await userModel.findByIdAndUpdate(userid, { $set: { password: await bcrypt.hash(newpassword, 10) } });
            res.redirect('/profile');
        }


        res.render('pages/resetpassword', {
            error: "enter correct password",
            user
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        await userModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
        const posts = await postModel.find({ postBy: id, isDeleted: false }).lean();
        const comments = await commentmodel.find({ commentBy: id, isDeleted: false }).lean();

        if (!posts || !comments) res.redirect('/signup');

        await postModel.updateMany({ postBy: id }, { $set: { isDeleted: true } });
        await commentModel.updateMany({ commentBy: id }, { $set: { isDeleted: true } });

        res.redirect('/signup')
    } catch (error) {
        next(error)
    }

}

exports.logout = async (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
}
