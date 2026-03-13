import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { searchUsers, fetchSuggestions, clearSearch } from '../features/users/usersSlice'
import { followUser } from '../features/users/usersSlice'
import { updateAuthUser } from '../features/auth/authSlice'
import Avatar from '../components/ui/Avatar'
import toast from 'react-hot-toast'

export default function ExplorePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { searchResults, suggestions } = useSelector((s) => s.users)
  const { user } = useSelector((s) => s.auth)
  const [query, setQuery] = useState('')

  useEffect(() => { dispatch(fetchSuggestions()) }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim()) dispatch(searchUsers(query))
      else dispatch(clearSearch())
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  const handleFollow = async (targetId) => {
    const res = await dispatch(followUser(targetId)).unwrap()
    dispatch(updateAuthUser({
      following: res.following
        ? [...(user.following || []), targetId]
        : (user.following || []).filter((id) => id !== targetId),
    }))
    dispatch(fetchSuggestions())
    toast.success(res.following ? 'Following!' : 'Unfollowed')
  }

  const list = query.trim() ? searchResults : suggestions

  return (
    <div>
      <div className="sticky top-0 z-10 bg-dark-400/90 backdrop-blur-md px-4 py-3 border-b border-dark-100">
        <h1 className="text-xl font-black text-slate-100 mb-3">Explore</h1>
        <div className="flex items-center gap-2 bg-dark-200 border border-dark-100 rounded-full px-4 py-2 focus-within:border-brand-500 transition-colors">
          <span className="text-slate-500">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent outline-none text-slate-100 text-sm flex-1 placeholder-slate-500 font-sans"
            autoFocus
          />
          {query && <button onClick={() => { setQuery(''); dispatch(clearSearch()) }} className="text-slate-500 hover:text-slate-300">✕</button>}
        </div>
      </div>

      <div>
        {list.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-3xl mb-2">👥</p>
            <p>{query ? 'No users found.' : 'No suggestions available.'}</p>
          </div>
        ) : (
          list.map((u) => (
            <div key={u._id} className="flex items-center gap-3 px-4 py-4 border-b border-dark-100 hover:bg-white/5 transition-colors">
              <button onClick={() => navigate(`/profile/${u._id}`)}>
                <Avatar user={u} size="lg" />
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/profile/${u._id}`)}
                  className="font-bold text-slate-100 hover:underline block text-left">{u.name}</button>
                <p className="text-sm text-slate-500">@{u.username}</p>
                {u.bio && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{u.bio}</p>}
                <p className="text-xs text-slate-600 mt-1">{u.followers?.length || 0} followers</p>
              </div>
              <button
                onClick={() => handleFollow(u._id)}
                className={user?.following?.includes(u._id) ? 'btn-outline text-sm' : 'btn-primary text-sm'}
              >
                {user?.following?.includes(u._id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
