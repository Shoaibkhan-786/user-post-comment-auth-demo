const {Router} = require('express');
const {auth} = require('../middlewares/session-checker');

const { logout, getProfile, updateProfile, updateProfileProcess, resetPassword, resetPasswordProcess, deleteUser } = require('../controller/user-controller');

const userRouter = Router({mergeParams:true});


userRouter.get('/profile', auth,  getProfile);

userRouter.get('/profile/update/:id', auth, updateProfile);

userRouter.put('/profile/update/:id', auth, updateProfileProcess);

userRouter.get('/resetpassword/:id', auth, resetPassword);

userRouter.put('/resetpassword/:id', auth, resetPasswordProcess);

userRouter.delete('/deleteprofile/:id',auth, deleteUser);

userRouter.get('/logout', logout);


module.exports = userRouter;



