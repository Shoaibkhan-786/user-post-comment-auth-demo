const {Router} = require('express');
const {auth} = require('../middlewares/session-checker');

const { signup, signupProcess, login, loginprocess, logout, getforgotPage, forgotPassword, setforgotPassword, changepassword, getProfile, updateProfile, updateProfileProcess, resetPassword, resetPasswordProcess, deleteUser } = require('../controller/user-controller');

const validation = require('../validation/uservalidation')
const { validate } =  require('express-validation')

const passport = require("passport");
require('../middlewares/passport')

const userRouter = Router({mergeParams:true});


userRouter.get('/signup', signup);

userRouter.post('/signup', signupProcess);

userRouter.get('/forgotPage', getforgotPage);

userRouter.post('/forgotpassword', forgotPassword);

userRouter.get('/forgot-password/:id/:token', setforgotPassword);

userRouter.post('/forgot-password/:id', changepassword);

userRouter.get('/profile', auth,  getProfile);

userRouter.get('/profile/update/:id', auth, updateProfile);

userRouter.put('/profile/update/:id', auth, updateProfileProcess);

userRouter.get('/resetpassword/:id', auth, resetPassword);

userRouter.put('/resetpassword/:id', auth, resetPasswordProcess);

userRouter.delete('/deleteprofile/:id',auth, deleteUser);


userRouter.get('/login', login);

userRouter.post('/login', passport.authenticate("login", { failureRedirect : '/login', failureFlash: 'invalid- credentials'}), loginprocess);

userRouter.get('/logout', logout);


module.exports = userRouter;



