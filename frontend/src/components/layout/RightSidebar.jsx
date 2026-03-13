import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSuggestions } from '../../features/users/usersSlice'
import { searchUsers, clearSearch } from '../../features/users/usersSlice'
import { followUser } from '../../features/users/usersSlice'
import { updateAuthUser } from '../../features/auth/authSlice'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'

export default function RightSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { suggestions, searchResults } = useSelector((s) => s.users)
  const { user } = useSelector((s) => s.auth)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => { dispatch(fetchSuggestions()) }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (debounced.trim()) dispatch(searchUsers(debounced))
    else dispatch(clearSearch())
  }, [debounced])

  const handleFollow = async (targetId) => {
    const res = await dispatch(followUser(targetId)).unwrap()
    const isNowFollowing = res.following
    dispatch(updateAuthUser({
      following: isNowFollowing
        ? [...(user.following || []), targetId]
        : (user.following || []).filter((id) => id !== targetId),
    }))
    dispatch(fetchSuggestions())
    toast.success(isNowFollowing ? 'Following!' : 'Unfollowed')
  }

  const displayList = debounced ? searchResults : suggestions

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-2 bg-dark-200 border border-dark-100 rounded-full px-4 py-2 focus-within:border-brand-500 transition-colors">
        <span className="text-slate-500">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="bg-transparent outline-none text-slate-100 text-sm flex-1 placeholder-slate-500 font-sans"
        />
        {query && (
          <button onClick={() => { setQuery(''); dispatch(clearSearch()) }}
            className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
        )}
      </div>

      {/* Users list */}
      <div className="card">
        <div className="px-4 py-3 border-b border-dark-100">
          <h3 className="font-bold text-slate-100">{debounced ? 'Search Results' : 'Who to Follow'}</h3>
        </div>
        {displayList.length === 0 ? (
          <p className="px-4 py-6 text-slate-500 text-sm text-center">
            {debounced ? 'No users found.' : 'No suggestions right now.'}
          </p>
        ) : (
          displayList.map((u) => (
            <div key={u._id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-dark-100 last:border-0">
              <button onClick={() => navigate(`/profile/${u._id}`)}>
                <Avatar user={u} size="md" />
              </button>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/profile/${u._id}`)}
                  className="font-bold text-sm text-slate-100 hover:underline block truncate text-left">
                  {u.name}
                </button>
                <p className="text-xs text-slate-500">@{u.username}</p>
              </div>
              <button
                onClick={() => handleFollow(u._id)}
                className={
                  user?.following?.includes(u._id)
                    ? 'btn-outline text-xs py-1 px-3'
                    : 'btn-primary text-xs py-1 px-3'
                }
              >
                {user?.following?.includes(u._id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Trending */}
      <div className="card">
        <div className="px-4 py-3 border-b border-dark-100">
          <h3 className="font-bold text-slate-100">Trending</h3>
        </div>
        {['#ReactJS', '#OpenSource', '#WebDev', '#TypeScript', '#BuildInPublic'].map((tag, i) => (
          <div key={tag} className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-dark-100 last:border-0 transition-colors">
            <p className="text-xs text-slate-500">#{i + 1} · Technology</p>
            <p className="font-bold text-sm text-slate-100">{tag}</p>
            <p className="text-xs text-slate-500">{(Math.random() * 50 + 5).toFixed(1)}K posts</p>
          </div>
        ))}
      </div>
    </div>
  )
}
