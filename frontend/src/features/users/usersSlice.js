import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usersAPI } from '../../services/api'
import { updateAuthUser } from '../auth/authSlice'

export const fetchUser = createAsyncThunk('users/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await usersAPI.getById(id)
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    const res = await usersAPI.update(id, data)
    dispatch(updateAuthUser(res.data.user))
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const followUser = createAsyncThunk('users/follow', async (id, { rejectWithValue }) => {
  try {
    const res = await usersAPI.follow(id)
    return { id, following: res.data.following }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const searchUsers = createAsyncThunk('users/search', async (username, { rejectWithValue }) => {
  try {
    const res = await usersAPI.search(username)
    return res.data.users
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchSuggestions = createAsyncThunk('users/suggestions', async (_, { rejectWithValue }) => {
  try {
    const res = await usersAPI.getSuggestions()
    return res.data.users
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    profileUser: null,
    suggestions: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => { state.searchResults = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.profileUser = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.profileUser = action.payload
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload
      })
  },
})

export const { clearSearch } = usersSlice.actions
export default usersSlice.reducer
