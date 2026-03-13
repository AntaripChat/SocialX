const COLORS = [
  'bg-violet-600', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-red-500', 'bg-pink-500', 'bg-cyan-500',
]

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-32 h-32 text-4xl',
}

function getColor(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Avatar({ user, size = 'md' }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const colorClass = getColor(user?._id || user?.username || '')

  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={user.name}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-dark-100 flex-shrink-0`}
      />
    )
  }

  return (
    <div
      className={`${sizeMap[size]} ${colorClass} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 border-2 border-dark-100`}
    >
      {initials}
    </div>
  )
}
