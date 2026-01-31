import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
// Service Worker and PWA disabled temporarily due to server MIME type issues
// import PWAInstallButton from './PWAInstallButton'
// import SWUpdateNotification from './SWUpdateNotification'
import TopUserBar from './TopUserBar'

function MainLayout() {
  return (
    <div className="relative flex flex-col w-full bg-white">
      <TopUserBar />
      {/* محتوای اصلی صفحه */}
      <div className="flex-1 pb-24">
        <Outlet />
      </div>
      
      {/* منوی ناوبری پایین */}
      <BottomNavigation />
      
      {/* Service Worker and PWA disabled temporarily */}
      {/* دکمه نصب PWA */}
      {/* <PWAInstallButton /> */}
      
      {/* اعلان به‌روزرسانی Service Worker */}
      {/* <SWUpdateNotification /> */}
    </div>
  )
}

export default MainLayout

