const {Router} = require('express');
const { signup, signupProcess, getforgotPage, forgotPassword, setforgotPassword, changepassword, login, loginprocess } = require('../controller/auth-controller');

const passport = require("passport");
require('../middlewares/passport')

const authRouter = Router({mergeParams:true});

authRouter.get('/signup', signup);

authRouter.post('/signup', signupProcess);

authRouter.get('/forgotPage', getforgotPage);

authRouter.post('/forgotpassword', forgotPassword);

authRouter.get('/forgot-password/:id/:token', setforgotPassword);

authRouter.post('/forgot-password/:id', changepassword);

authRouter.get('/login', login);

authRouter.post('/login', passport.authenticate("login", { failureRedirect : '/login', failureFlash: 'invalid- credentials'}), loginprocess);

module.exports = authRouter;