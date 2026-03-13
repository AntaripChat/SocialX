import { useState, useEffect } from 'react'
import { getSocket } from '../services/socket'

const mockNotifs = [
  { id: 1, type: 'like', user: 'Sam Okafor', text: 'liked your post', time: '2m', icon: '❤️' },
  { id: 2, type: 'follow', user: 'Priya Nair', text: 'followed you', time: '10m', icon: '👤' },
  { id: 3, type: 'comment', user: 'Jamie Chen', text: 'commented on your post', time: '1h', icon: '💬' },
]

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(mockNotifs)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onLike = (data) => {
      setNotifs((prev) => [{ id: Date.now(), type: 'like', user: data.liker.name, text: 'liked your post', time: 'now', icon: '❤️' }, ...prev])
    }
    const onFollow = (data) => {
      setNotifs((prev) => [{ id: Date.now(), type: 'follow', user: data.follower.name, text: 'followed you', time: 'now', icon: '👤' }, ...prev])
    }
    const onComment = (data) => {
      setNotifs((prev) => [{ id: Date.now(), type: 'comment', user: data.comment?.userId?.name || 'Someone', text: 'commented on your post', time: 'now', icon: '💬' }, ...prev])
    }

    socket.on('postLiked', onLike)
    socket.on('newFollower', onFollow)
    socket.on('newComment', onComment)
    return () => { socket.off('postLiked', onLike); socket.off('newFollower', onFollow); socket.off('newComment', onComment) }
  }, [])

  return (
    <div>
      <div className="sticky top-0 z-10 bg-dark-400/90 backdrop-blur-md px-4 py-3 border-b border-dark-100">
        <h1 className="text-xl font-black text-slate-100">Notifications</h1>
      </div>

      {notifs.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-4xl mb-2">🔔</p>
          <p>No notifications yet.</p>
        </div>
      ) : (
        notifs.map((n) => (
          <div key={n.id} className="flex items-start gap-4 px-4 py-4 border-b border-dark-100 hover:bg-white/5 transition-colors animate-fade-in">
            <span className="text-2xl">{n.icon}</span>
            <div className="flex-1">
              <p className="text-slate-200 text-sm">
                <strong className="text-slate-100">{n.user}</strong> {n.text}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
