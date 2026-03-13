import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-dark-400">
      <div className="max-w-7xl mx-auto flex">
        {/* Left sidebar */}
        <aside className="w-64 xl:w-72 shrink-0 hidden md:flex flex-col sticky top-0 h-screen border-r border-dark-100">
          <LeftSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 border-r border-dark-100">
          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside className="w-80 xl:w-96 shrink-0 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}
