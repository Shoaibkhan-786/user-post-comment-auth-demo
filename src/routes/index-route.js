const { Router } = require('express');
const userRouter = require('./user-route');
const postRouter = require('./post-route');
const commentRouter = require('./comment-route');
const { auth } = require('../middlewares/session-checker');
const {homePage} = require('../controller/user-controller');
const authRouter = require('./auth-route');

const indexRouter = Router({mergeParams:true});


indexRouter.get('/', auth,  homePage);

indexRouter.use(authRouter);

indexRouter.use(userRouter);

indexRouter.use(postRouter);

indexRouter.use(commentRouter);


module.exports = indexRouter;