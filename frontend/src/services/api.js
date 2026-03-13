import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  follow: (id) => api.put(`/users/follow/${id}`),
  search: (username) => api.get(`/users/search?username=${username}`),
  getSuggestions: () => api.get('/users/suggestions'),
}

// ── Posts ─────────────────────────────────────────────────────────────────────
export const postsAPI = {
  create: (data) => api.post('/posts', data),
  delete: (id) => api.delete(`/posts/${id}`),
  getFeed: (type = 'global', page = 1) => api.get(`/posts/feed?type=${type}&page=${page}&limit=10`),
  getUserPosts: (userId, page = 1) => api.get(`/posts/user/${userId}?page=${page}&limit=10`),
  like: (id) => api.put(`/posts/like/${id}`),
  comment: (id, text) => api.post(`/posts/comment/${id}`, { text }),
}

export default api
