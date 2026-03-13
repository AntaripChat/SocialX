import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../../features/posts/postsSlice'
import Avatar from '../ui/Avatar'
import toast from 'react-hot-toast'

const MAX = 280

export default function ComposeBox() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const remaining = MAX - text.length
  const pct = Math.min((text.length / MAX) * 100, 100)
  const color = remaining < 0 ? '#ef4444' : remaining < 30 ? '#f59e0b' : '#3b82f6'
  const size = 24
  const r = 9
  const circ = 2 * Math.PI * r

  const handleSubmit = async () => {
    if (!text.trim() || remaining < 0) return
    setLoading(true)
    try {
      await dispatch(createPost(text)).unwrap()
      setText('')
      toast.success('Posted!')
    } catch (e) {
      toast.error(e || 'Failed to post')
    }
    setLoading(false)
  }

  return (
    <div className="p-4 border-b border-dark-100 flex gap-3">
      <Avatar user={user} size="md" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full bg-transparent outline-none text-slate-100 text-lg resize-none placeholder-slate-600 font-sans leading-relaxed caret-brand-500"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dark-100">
          <div className="flex items-center gap-3 text-brand-500 text-sm">
            <button className="hover:bg-brand-500/10 p-1.5 rounded-full transition-colors">📷</button>
            <button className="hover:bg-brand-500/10 p-1.5 rounded-full transition-colors">😊</button>
          </div>
          <div className="flex items-center gap-3">
            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                  <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2d3748" strokeWidth={2} />
                  <circle
                    cx={size/2} cy={size/2} r={r} fill="none"
                    stroke={color} strokeWidth={2}
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.2s, stroke 0.2s' }}
                  />
                </svg>
                <span className="text-xs font-mono" style={{ color }}>{remaining}</span>
              </div>
            )}
            <button
              disabled={!text.trim() || remaining < 0 || loading}
              onClick={handleSubmit}
              className="btn-primary text-sm"
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
