const express = require('express');
const router = express.Router();
const { getUserById, updateUser, followUser, searchUsers, getSuggestions } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, upload.single('profilePicture'), updateUser);
router.put('/follow/:id', protect, followUser);

module.exports = router;
