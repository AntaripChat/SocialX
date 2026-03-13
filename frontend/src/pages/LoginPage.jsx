import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { loginUser, clearError } from '../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-screen bg-dark-400 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-dark-300 via-dark-400 to-dark-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute text-6xl opacity-30 font-bold text-brand-500"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: 'rotate(-15deg)' }}>
              ✦
            </div>
          ))}
        </div>
        <div className="text-center z-10">
          <div className="text-8xl mb-6 font-bold text-brand-500">✦</div>
          <h1 className="text-5xl font-black text-slate-100 mb-3">SocialX</h1>
          <p className="text-slate-400 text-lg">Share your world.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-4xl font-bold text-brand-500 mb-2 lg:hidden">✦</div>
          <h2 className="text-3xl font-black text-slate-100 mb-2">Sign in</h2>
          <p className="text-slate-500 mb-8 text-sm">Welcome back! Enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
