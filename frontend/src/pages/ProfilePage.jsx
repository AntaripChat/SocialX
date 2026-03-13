import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../features/users/usersSlice'
import { followUser } from '../features/users/usersSlice'
import { fetchUserPosts, clearUserPosts } from '../features/posts/postsSlice'
import { updateAuthUser } from '../features/auth/authSlice'
import Avatar from '../components/ui/Avatar'
import PostCard from '../components/posts/PostCard'
import { SkeletonProfile, SkeletonPost } from '../components/ui/Skeleton'
import EditProfileModal from '../components/profile/EditProfileModal'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profileUser, loading } = useSelector((s) => s.users)
  const { userPosts } = useSelector((s) => s.posts)
  const { user: currentUser } = useSelector((s) => s.auth)
  const [showEdit, setShowEdit] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  const isOwn = id === currentUser?._id

  useEffect(() => {
    dispatch(fetchUser(id))
    dispatch(clearUserPosts())
    dispatch(fetchUserPosts({ userId: id, page: 1 }))
  }, [id])

  const handleFollow = async () => {
    const res = await dispatch(followUser(id)).unwrap()
    dispatch(updateAuthUser({
      following: res.following
        ? [...(currentUser.following || []), id]
        : (currentUser.following || []).filter((fid) => fid !== id),
    }))
    dispatch(fetchUser(id))
    toast.success(res.following ? 'Following!' : 'Unfollowed')
  }

  const isFollowing = currentUser?.following?.includes(id)

  if (loading || !profileUser) {
    return (
      <div>
        <div className="sticky top-0 z-10 bg-dark-400/90 backdrop-blur-md px-4 py-3 border-b border-dark-100 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-100">←</button>
          <h1 className="text-xl font-black text-slate-100">Profile</h1>
        </div>
        <SkeletonProfile />
        {Array.from({ length: 3 }).map((_, i) => <SkeletonPost key={i} />)}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-400/90 backdrop-blur-md px-4 py-3 border-b border-dark-100 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-100">←</button>
        <div>
          <h1 className="text-xl font-black text-slate-100 leading-tight">{profileUser.name}</h1>
          <p className="text-xs text-slate-500">{userPosts.length} posts</p>
        </div>
      </div>

      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-brand-700 via-violet-700 to-brand-500 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxmaWx0ZXIgaWQ9J24nPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjknIG51bU9jdGF2ZXM9JzQnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbiknIG9wYWNpdHk9JzEnLz48L3N2Zz4=')]" />
      </div>

      {/* Profile info */}
      <div className="px-4 pb-4 border-b border-dark-100">
        <div className="flex justify-between items-start -mt-16 mb-3">
          <div className="border-4 border-dark-400 rounded-full bg-dark-400 shrink-0 inline-flex items-center justify-center relative z-20">
            <Avatar user={profileUser} size="2xl" />
          </div>
          <div className="mt-16 shrink-0">
            {isOwn ? (
              <button onClick={() => setShowEdit(true)} className="btn-outline text-sm">Edit Profile</button>
            ) : (
              <button onClick={handleFollow} className={isFollowing ? 'btn-outline text-sm' : 'btn-primary text-sm'}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <h2 className="font-black text-xl text-slate-100">{profileUser.name}</h2>
        <p className="text-slate-500 text-sm mb-2">@{profileUser.username}</p>
        {profileUser.bio && <p className="text-slate-300 text-sm mb-3 leading-relaxed">{profileUser.bio}</p>}
        {profileUser.website && (
          <a href={profileUser.website} target="_blank" rel="noopener noreferrer"
            className="text-brand-500 text-sm hover:underline mb-3 inline-block">
            🔗 {profileUser.website}
          </a>
        )}

        <div className="flex gap-5 text-sm mt-2">
          <span className="text-slate-500">
            <strong className="text-slate-100 font-bold">{profileUser.following?.length || 0}</strong> Following
          </span>
          <span className="text-slate-500">
            <strong className="text-slate-100 font-bold">{profileUser.followers?.length || 0}</strong> Followers
          </span>
        </div>
      </div>

      {/* Posts */}
      <div className="flex border-b border-dark-100">
        {['posts', 'replies'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors relative ${activeTab === tab ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-500 rounded-full" />}
          </button>
        ))}
      </div>

      {userPosts.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p className="text-3xl mb-2">📝</p>
          <p>{isOwn ? "You haven't posted yet!" : "No posts yet."}</p>
        </div>
      ) : (
        userPosts.map((post) => <PostCard key={post._id} post={post} />)
      )}

      {showEdit && <EditProfileModal user={currentUser} onClose={() => setShowEdit(false)} />}
    </div>
  )
}
