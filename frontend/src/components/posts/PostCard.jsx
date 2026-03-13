import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { likePost, deletePost, addComment } from '../../features/posts/postsSlice'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000)
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}

export default function PostCard({ post }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const author = post.userId
  const liked = post.likes?.some((id) => id === user?._id || id?._id === user?._id)
  const isOwn = author?._id === user?._id

  const handleLike = () => dispatch(likePost(post._id))

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    await dispatch(deletePost(post._id))
    toast.success('Post deleted')
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    setSubmitting(true)
    await dispatch(addComment({ id: post._id, text: commentText }))
    setCommentText('')
    setSubmitting(false)
    toast.success('Comment added!')
  }

  return (
    <article className="p-4 border-b border-dark-100 hover:bg-white/[0.02] transition-colors animate-fade-in">
      <div className="flex gap-3">
        <button onClick={() => navigate(`/profile/${author?._id}`)}>
          <Avatar user={author} size="md" />
        </button>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${author?._id}`)}
              className="font-bold text-slate-100 hover:underline text-sm"
            >
              {author?.name}
            </button>
            <span className="text-slate-500 text-sm">@{author?.username}</span>
            <span className="text-slate-600 text-xs ml-auto">{timeAgo(post.createdAt)}</span>
            {isOwn && (
              <button onClick={handleDelete} className="text-slate-600 hover:text-red-400 transition-colors text-sm" title="Delete">
                🗑
              </button>
            )}
          </div>

          {/* Text */}
          <p className="text-slate-200 text-sm leading-relaxed mb-3 break-words">{post.text}</p>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button onClick={handleLike}
              className={`post-action ${liked ? 'text-red-400 hover:text-red-400' : ''}`}>
              <span className="text-base">{liked ? '❤️' : '🤍'}</span>
              <span>{post.likes?.length || 0}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)}
              className={`post-action ${showComments ? 'text-brand-500' : ''}`}>
              <span className="text-base">💬</span>
              <span>{post.comments?.length || 0}</span>
            </button>
            <button className="post-action">
              <span className="text-base">🔁</span>
              <span>{Math.floor((post.likes?.length || 0) * 1.3)}</span>
            </button>
            <button className="post-action ml-auto">
              <span className="text-base">↗</span>
            </button>
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-3 pt-3 border-t border-dark-100 space-y-3 animate-fade-in">
              {post.comments?.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Avatar user={c.userId} size="sm" />
                  <div className="bg-dark-200 rounded-2xl px-3 py-2 flex-1 min-w-0">
                    <span className="font-semibold text-xs text-slate-400">@{c.userId?.username} </span>
                    <span className="text-sm text-slate-300">{c.text}</span>
                  </div>
                </div>
              ))}
              {/* Add comment */}
              <div className="flex gap-2">
                <Avatar user={user} size="sm" />
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    placeholder="Add a comment…"
                    className="flex-1 bg-dark-200 border border-dark-100 rounded-full px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-brand-500 transition-colors font-sans"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim() || submitting}
                    className="btn-primary text-xs py-1 px-4"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
