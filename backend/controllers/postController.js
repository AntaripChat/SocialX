const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Post text is required' });
    }

    const post = await Post.create({ userId: req.user._id, text: text.trim() });
    await post.populate('userId', '_id name username profilePicture');

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('newPost', post);

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    const io = req.app.get('io');
    io.emit('deletePost', req.params.id);

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global feed (all posts, paginated)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type || 'global'; // 'global' | 'following'

    let query = {};
    if (type === 'following') {
      query = { userId: { $in: [...req.user.following, req.user._id] } };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', '_id name username profilePicture')
      .populate('comments.userId', '_id name username profilePicture');

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit), hasMore: skip + posts.length < total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', '_id name username profilePicture')
      .populate('comments.userId', '_id name username profilePicture');

    const total = await Post.countDocuments({ userId: req.params.userId });

    res.json({
      success: true,
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit), hasMore: skip + posts.length < total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);

      // Notify post owner
      const io = req.app.get('io');
      if (post.userId.toString() !== req.user._id.toString()) {
        io.to(post.userId.toString()).emit('postLiked', {
          postId: post._id,
          liker: { _id: req.user._id, name: req.user.name, username: req.user.username },
        });
      }
    }

    await post.save();

    res.json({ success: true, likes: post.likes, liked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ userId: req.user._id, text: text.trim() });
    await post.save();
    await post.populate('comments.userId', '_id name username profilePicture');

    const newComment = post.comments[post.comments.length - 1];

    // Notify post owner
    const io = req.app.get('io');
    if (post.userId.toString() !== req.user._id.toString()) {
      io.to(post.userId.toString()).emit('newComment', {
        postId: post._id,
        comment: newComment,
      });
    }

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, deletePost, getFeed, getUserPosts, likePost, addComment };
