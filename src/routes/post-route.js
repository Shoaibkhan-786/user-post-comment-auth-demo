const { Router } = require('express');
const { auth } = require('../middlewares/session-checker');
const { createPost, createPostProcess, fetchAllPost, deletePost, editPost, updatePost } = require('../controller/post-controller');
const postRouter = Router();
const validation = require('../validation/postvalidation')
const { validate } =  require('express-validation')

postRouter.get('/createpost', auth, createPost);

postRouter.post('/createpost',  auth, createPostProcess);

postRouter.get('/allpost', auth, fetchAllPost);

postRouter.delete('/posts/delete/:id', auth, deletePost);

postRouter.get('/posts/edit/:id', auth, editPost);

postRouter.put('/posts/edit/:id',  auth, updatePost);

module.exports = postRouter;