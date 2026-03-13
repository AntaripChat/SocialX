# SocialX — Full-Stack Twitter Clone

A modern, full-stack social media application built with the MERN stack.

---

## 🗂 Project Structure

```
twitter-app/
├── backend/          # Express.js + MongoDB API
│   ├── config/       # DB connection
│   ├── controllers/  # Route handlers (MVC)
│   ├── middleware/   # Auth, upload, error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   └── server.js     # Entry point + Socket.io
│
└── frontend/         # Vite + React app
    └── src/
        ├── components/
        │   ├── layout/    # MainLayout, LeftSidebar, RightSidebar
        │   ├── posts/     # PostCard, ComposeBox, PostFeed
        │   ├── profile/   # EditProfileModal
        │   └── ui/        # Avatar, Skeleton
        ├── features/      # Redux slices (auth, posts, users)
        ├── pages/         # HomePage, ProfilePage, ExplorePage, etc.
        ├── services/      # Axios API client + Socket.io
        └── store.js       # Redux store
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Create uploads directory
mkdir uploads

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open your browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## ⚙️ Environment Variables (backend/.env)

| Variable     | Description                       |
|-------------|-----------------------------------|
| PORT         | Server port (default: 5000)       |
| MONGO_URI    | MongoDB connection string          |
| JWT_SECRET   | Secret key for JWT signing        |
| CLIENT_URL   | Frontend URL for CORS             |
| NODE_ENV     | development / production          |

---

## 📡 API Reference

### Auth
| Method | Route                    | Description       |
|--------|--------------------------|-------------------|
| POST   | /api/auth/register       | Register user     |
| POST   | /api/auth/login          | Login user        |
| GET    | /api/auth/me             | Get current user  |

### Users
| Method | Route                         | Description           |
|--------|-------------------------------|-----------------------|
| GET    | /api/users/:id                | Get user profile      |
| PUT    | /api/users/:id                | Update profile + pic  |
| PUT    | /api/users/follow/:id         | Follow / Unfollow     |
| GET    | /api/users/search?username=   | Search users          |
| GET    | /api/users/suggestions        | Get suggestions       |

### Posts
| Method | Route                         | Description          |
|--------|-------------------------------|----------------------|
| POST   | /api/posts                    | Create post          |
| DELETE | /api/posts/:id                | Delete post          |
| GET    | /api/posts/feed?type=global   | Global feed          |
| GET    | /api/posts/feed?type=following| Following feed       |
| GET    | /api/posts/user/:userId       | User's posts         |
| PUT    | /api/posts/like/:id           | Like / Unlike post   |
| POST   | /api/posts/comment/:id        | Add comment          |

---

## ✨ Features

- **Authentication** — JWT-based, bcrypt password hashing, protected routes
- **User Profiles** — Edit name, bio, website, avatar upload
- **Posts** — Create, delete, like/unlike, comment, 280-char limit
- **Feeds** — Global + Following feed with infinite scroll pagination
- **Real-time** — Socket.io for live new posts, likes, comments, follows
- **Search** — Search users by username (debounced)
- **Responsive** — Mobile-first, collapsing sidebars
- **Redux Toolkit** — Global state with async thunks
- **Skeleton Loaders** — Smooth loading states
- **Toast Notifications** — Action feedback via react-hot-toast

---

## 🛠 Tech Stack

| Layer       | Tech                            |
|------------|----------------------------------|
| Frontend   | Vite, React 18, Tailwind CSS     |
| State      | Redux Toolkit                    |
| Backend    | Express.js, Node.js              |
| Database   | MongoDB, Mongoose                |
| Auth       | JWT, bcryptjs                    |
| Real-time  | Socket.io                        |
| Upload     | Multer (local storage)           |

---

## 📦 Optional Enhancements

- **Cloudinary** — Replace Multer with Cloudinary for cloud image storage
- **Dark/Light mode** — Toggle via Tailwind `darkMode: 'class'`
- **Notifications system** — Persist notifications in MongoDB
- **Infinite scroll** — Already wired via IntersectionObserver
- **Post images** — Add image upload to the compose box
