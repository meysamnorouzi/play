import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import PWAInstallButton from './PWAInstallButton'
import SWUpdateNotification from './SWUpdateNotification'

function MainLayout() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* محتوای اصلی صفحه */}
      <div className="pb-24">
        <Outlet />
      </div>
      
      {/* منوی ناوبری پایین */}
      <BottomNavigation />
      
      {/* دکمه نصب PWA */}
      <PWAInstallButton />
      
      {/* اعلان به‌روزرسانی Service Worker */}
      <SWUpdateNotification />
    </div>
  )
}

export default MainLayout

