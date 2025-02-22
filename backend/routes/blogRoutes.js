const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPost);
router.post('/posts', blogController.createPost);
router.put('/posts/:slug', blogController.updatePost);
router.delete('/posts/:slug', blogController.deletePost);

module.exports = router; 