import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postsAPI } from '../../services/api'

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async ({ type, page }, { rejectWithValue }) => {
  try {
    const res = await postsAPI.getFeed(type, page)
    return { ...res.data, page, type }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch posts')
  }
})

export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async ({ userId, page }, { rejectWithValue }) => {
  try {
    const res = await postsAPI.getUserPosts(userId, page)
    return { ...res.data, page }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const createPost = createAsyncThunk('posts/create', async (text, { rejectWithValue }) => {
  try {
    const res = await postsAPI.create({ text })
    return res.data.post
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post')
  }
})

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await postsAPI.delete(id)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const likePost = createAsyncThunk('posts/like', async (id, { rejectWithValue }) => {
  try {
    const res = await postsAPI.like(id)
    return { id, ...res.data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addComment = createAsyncThunk('posts/comment', async ({ id, text }, { rejectWithValue }) => {
  try {
    const res = await postsAPI.comment(id, text)
    return { id, comment: res.data.comment }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    userPosts: [],
    loading: false,
    loadingMore: false,
    error: null,
    pagination: { page: 1, hasMore: true },
    feedType: 'global',
  },
  reducers: {
    setFeedType: (state, action) => {
      state.feedType = action.payload
      state.posts = []
      state.pagination = { page: 1, hasMore: true }
    },
    addRealTimePost: (state, action) => {
      state.posts.unshift(action.payload)
    },
    removeRealTimePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload)
    },
    clearUserPosts: (state) => { state.userPosts = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg.page === 1) state.loading = true
        else state.loadingMore = true
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false
        state.loadingMore = false
        if (action.payload.page === 1) state.posts = action.payload.posts
        else state.posts = [...state.posts, ...action.payload.posts]
        state.pagination = action.payload.pagination
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false
        state.loadingMore = false
        state.error = action.payload
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        if (action.payload.page === 1) state.userPosts = action.payload.posts
        else state.userPosts = [...state.userPosts, ...action.payload.posts]
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload)
        state.userPosts = state.userPosts.filter((p) => p._id !== action.payload)
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const update = (arr) =>
          arr.map((p) => p._id === action.payload.id ? { ...p, likes: action.payload.likes } : p)
        state.posts = update(state.posts)
        state.userPosts = update(state.userPosts)
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const update = (arr) =>
          arr.map((p) =>
            p._id === action.payload.id
              ? { ...p, comments: [...p.comments, action.payload.comment] }
              : p
          )
        state.posts = update(state.posts)
        state.userPosts = update(state.userPosts)
      })
  },
})

export const { setFeedType, addRealTimePost, removeRealTimePost, clearUserPosts } = postsSlice.actions
export default postsSlice.reducer
