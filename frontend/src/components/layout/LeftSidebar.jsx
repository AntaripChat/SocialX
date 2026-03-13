import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/explore', label: 'Explore', icon: '🔍' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
]

export default function LeftSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="px-4 mb-6">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
          ✦
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active font-bold' : ''}`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to={`/profile/${user?._id}`}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active font-bold' : ''}`
          }
        >
          <span className="text-xl">👤</span>
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* User chip */}
      <div className="mt-auto">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-white/5 cursor-pointer transition-all"
          onClick={() => navigate(`/profile/${user?._id}`)}
        >
          <Avatar user={user} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500">@{user?.username}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout() }}
            className="text-slate-500 hover:text-red-400 transition-colors text-sm px-2"
            title="Logout"
          >
            ↩
          </button>
        </div>
      </div>
    </div>
  )
}
