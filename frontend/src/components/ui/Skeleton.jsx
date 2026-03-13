export function SkeletonPost() {
  return (
    <div className="p-4 border-b border-dark-100 flex gap-3 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-dark-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-4 bg-dark-100 rounded-full w-28" />
          <div className="h-4 bg-dark-100 rounded-full w-20" />
        </div>
        <div className="h-4 bg-dark-100 rounded-full w-full" />
        <div className="h-4 bg-dark-100 rounded-full w-3/4" />
        <div className="flex gap-6 mt-2">
          <div className="h-4 bg-dark-100 rounded-full w-10" />
          <div className="h-4 bg-dark-100 rounded-full w-10" />
          <div className="h-4 bg-dark-100 rounded-full w-10" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="animate-pulse">
      <div className="h-36 bg-dark-100" />
      <div className="px-4 pb-4">
        <div className="w-20 h-20 rounded-full bg-dark-200 border-4 border-dark-400 -mt-10 mb-3" />
        <div className="h-5 bg-dark-100 rounded w-40 mb-2" />
        <div className="h-4 bg-dark-100 rounded w-24 mb-3" />
        <div className="h-4 bg-dark-100 rounded w-full mb-1" />
        <div className="h-4 bg-dark-100 rounded w-3/4" />
      </div>
    </div>
  )
}
