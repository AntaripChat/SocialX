import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { registerUser, clearError } from '../features/auth/authSlice'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  return (
    <div className="min-h-screen bg-dark-400 flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-dark-300 via-dark-400 to-dark-400">
        <div className="text-center">
          <div className="text-8xl mb-6 font-bold text-brand-500">✦</div>
          <h1 className="text-5xl font-black text-slate-100 mb-3">SocialX</h1>
          <p className="text-slate-400 text-lg">Connect. Share. Discover.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-4xl font-bold text-brand-500 mb-2 lg:hidden">✦</div>
          <h2 className="text-3xl font-black text-slate-100 mb-2">Create account</h2>
          <p className="text-slate-500 mb-8 text-sm">Join the conversation today.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'username', label: 'Username', type: 'text', placeholder: 'yourhandle' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-field"
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
