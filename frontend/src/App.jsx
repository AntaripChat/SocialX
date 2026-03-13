import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { initSocket } from './services/socket'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotificationsPage from './pages/NotificationsPage'

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth)
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth)
  return !user ? children : <Navigate to="/" replace />
}

function App() {
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    if (user) initSocket(user._id)
  }, [user])

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1e2535',
            color: '#f1f5f9',
            borderRadius: '40px',
            border: '1px solid #2d3748',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
          },
          success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
