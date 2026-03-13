import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeed, setFeedType, addRealTimePost, removeRealTimePost } from '../../features/posts/postsSlice'
import { getSocket } from '../../services/socket'
import PostCard from './PostCard'
import { SkeletonPost } from '../ui/Skeleton'

export default function PostFeed() {
  const dispatch = useDispatch()
  const { posts, loading, loadingMore, pagination, feedType } = useSelector((s) => s.posts)
  const observerRef = useRef()
  const loaderRef = useRef()

  useEffect(() => {
    dispatch(fetchFeed({ type: feedType, page: 1 }))
  }, [feedType])

  // Real-time socket
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const onNew = (post) => { if (feedType === 'global') dispatch(addRealTimePost(post)) }
    const onDelete = (id) => dispatch(removeRealTimePost(id))
    socket.on('newPost', onNew)
    socket.on('deletePost', onDelete)
    return () => { socket.off('newPost', onNew); socket.off('deletePost', onDelete) }
  }, [feedType])

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (pagination?.hasMore && !loadingMore) {
      dispatch(fetchFeed({ type: feedType, page: (pagination?.page || 1) + 1 }))
    }
  }, [pagination, loadingMore, feedType])

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore()
    }, { threshold: 0.1 })
    if (loaderRef.current) observerRef.current.observe(loaderRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  const tabs = [
    { label: 'For You', value: 'global' },
    { label: 'Following', value: 'following' },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-dark-100 sticky top-0 bg-dark-400/90 backdrop-blur-md z-10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => dispatch(setFeedType(tab.value))}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              feedType === tab.value ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {feedType === tab.value && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />)
      ) : posts.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-4xl mb-3">👋</p>
          <p className="font-semibold">No posts yet.</p>
          <p className="text-sm mt-1">Follow some people to see their posts here.</p>
        </div>
      ) : (
        <>
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
          {loadingMore && Array.from({ length: 2 }).map((_, i) => <SkeletonPost key={i} />)}
          <div ref={loaderRef} className="h-10" />
          {!pagination?.hasMore && posts.length > 0 && (
            <p className="py-8 text-center text-sm text-slate-600">You're all caught up ✓</p>
          )}
        </>
      )}
    </div>
  )
}
