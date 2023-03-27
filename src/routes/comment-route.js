const { Router } = require('express');
const { auth } = require('../middlewares/session-checker');
const { createComment, deleteComment, editComment, updateComment } = require('../controller/comment-controller');

const commentRouter = Router();


commentRouter.post('/createcomment',  auth, createComment);

commentRouter.delete('/comments/delete/:id', auth, deleteComment);

commentRouter.get('/comments/update/:id', auth, editComment);

commentRouter.put('/comments/update/:id', auth, updateComment);


module.exports = commentRouter;
