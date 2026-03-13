const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', '_id name username profilePicture')
      .populate('following', '_id name username profilePicture')
      .select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const { name, bio, website } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;

    if (req.file) {
      // Delete old profile picture if it exists
      const oldUser = await User.findById(req.params.id);
      if (oldUser.profilePicture && oldUser.profilePicture.startsWith('/uploads/')) {
        const oldPath = '.' + oldUser.profilePicture;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('followers', '_id name username profilePicture')
      .populate('following', '_id name username profilePicture')
      .select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow / Unfollow user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    const isFollowing = req.user.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });

      // Real-time notification
      const io = req.app.get('io');
      io.to(req.params.id).emit('newFollower', {
        follower: { _id: req.user._id, name: req.user.name, username: req.user.username, profilePicture: req.user.profilePicture },
      });
    }

    res.json({ success: true, following: !isFollowing });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by username
// @route   GET /api/users/search?username=
// @access  Private
const searchUsers = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ success: false, message: 'Username query required' });

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: req.user._id },
    })
      .limit(10)
      .select('_id name username profilePicture bio followers');

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users (not following)
// @route   GET /api/users/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
  try {
    const users = await User.find({
      _id: { $nin: [...req.user.following, req.user._id] },
    })
      .limit(5)
      .select('_id name username profilePicture bio followers');

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, updateUser, followUser, searchUsers, getSuggestions };
