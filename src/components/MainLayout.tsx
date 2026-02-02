import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import PWAInstallButton from './PWAInstallButton'
import TopUserBar from './TopUserBar'

function MainLayout() {
  return (
    <div className="relative flex flex-col w-full bg-white">
      <TopUserBar />
      <div className="flex-1 pb-24">
        <Outlet />
      </div>
      <BottomNavigation />
      <PWAInstallButton />
    </div>
  )
}

export default MainLayout

