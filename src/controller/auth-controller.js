const userModel = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.signup = async (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/logout')
        }
        else {
            res.render("pages/signup", {
                isLoggedIn: false,
                error: ""
            });
        }
    } catch (error) {
        next(error)
    }
}


exports.signupProcess = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const schema = Joi.object({
            username: Joi.string().min(3).max(20).trim().required(),
            email: Joi.string().min(3).trim().required().lowercase().email(),
            password: Joi.string().min(3).max(8).trim().required(),
        })

        let result = schema.validate(req.body);

        if (result.error) {
            return res.render('pages/signup', {
                error: result.error.details[0].message,
                isLoggedIn: false
            });
        }

        const user = await userModel.findOne({ email, isDeleted: false }).lean();
        if (!user) {
            await userModel.create({ username, email, password });
            res.redirect('/login');
        } else {
            res.render("pages/signup", {
                error: "user already exist",
                isLoggedIn: false
            })
        }

    } catch (error) {
        next(error)
    }
}



exports.getforgotPage = async (req, res, next) => {
    res.render('pages/forgotpage', {
        error: ""
    });
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email, isDeleted: false });

        if (!user) {
            res.render('pages/forgotpage', {
                error: 'enter valid email'
            })
        }

        const secret = process.env.forgot_password_secret + user.password;
        const payload = {
            _id: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, secret, { expiresIn: '10m' });

        const link = `http//localhost:4000/forgot-password/${user._id}/${token}`;
        res.render('pages/forgotlink', {
            link,
            _id: user._id,
            token
        })
    } catch (error) {
        next(error)
    }
}



exports.setforgotPassword = async (req, res, next) => {
    try {
        const { id, token } = req.params;

        let user = await userModel.findById(id, { isDeleted: false });
        if (!user) {
            res.render('pages/forgotpage', {
                error: 'user not exist'
            })
        }

        const secret = process.env.forgot_password_secret + user.password;

        const payload = jwt.verify(token, secret);
        if (!payload) {
            res.render('pages/forgotpage', {
                error: 'link wasted'
            })
        }

        res.render('pages/setforgotpassword', {
            error: "",
            _id: user._id
        })


    } catch (error) {
        next(error)
    }
}


exports.changepassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password, confirmPassword } = req.body;

        const schema = Joi.object({
            password: Joi.string().min(3).max(8).trim().required(),
            confirmpassword: Joi.any().valid(Joi.ref('password')).required()
        })

        let result = schema.validate(req.body);

        if (result.error) {
            return res.render('pages/setforgotpassword', {
                error: result.error.details[0].message,
                _id: id,
            });
        }

        let user = await userModel.findById(id, { isDeleted: false });
        if (!user) {
            res.render('pages/forgotpage', {
                error: 'user not exist'
            })
        }

        await userModel.findByIdAndUpdate(id, { $set: { password: await bcrypt.hash(confirmPassword, 10) } });
        res.redirect('/login');


    } catch (error) {
        next(error)
    }

}


exports.login = async (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('pages/login', {
                error: "",
                isLoggedIn: false
            })
        }

    } catch (error) {
        next(error)
    }
}


exports.loginprocess = async (req, res, next) => {
    try {

        req.session.user = req.user.id;
        req.session.role = req.user.role;
        res.locals.session = req.session;
        res.redirect('/');

    } catch (error) {
        next(error)
    }
}