import ComposeBox from '../components/posts/ComposeBox'
import PostFeed from '../components/posts/PostFeed'

export default function HomePage() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-dark-400/90 backdrop-blur-md px-4 py-3 border-b border-dark-100">
        <h1 className="text-xl font-black text-slate-100">Home</h1>
      </div>
      <ComposeBox />
      <PostFeed />
    </div>
  )
}
