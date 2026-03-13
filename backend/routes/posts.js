const express = require('express');
const router = express.Router();
const { createPost, deletePost, getFeed, getUserPosts, likePost, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPost);
router.get('/feed', protect, getFeed);
router.get('/user/:userId', protect, getUserPosts);
router.delete('/:id', protect, deletePost);
router.put('/like/:id', protect, likePost);
router.post('/comment/:id', protect, addComment);

module.exports = router;
