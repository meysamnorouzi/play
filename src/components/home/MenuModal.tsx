import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  WalletIcon, 
  Squares2X2Icon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Modal from '../Modal'

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  path?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action?: () => void
  color?: string
}

function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  const mainMenuItems: MenuItem[] = [
    { path: '/', label: 'خانه', icon: HomeIcon },
    { path: '/wallet', label: 'کیف پول', icon: WalletIcon },
    { path: '/categories', label: 'آکادمی', icon: Squares2X2Icon },
    { path: '/children', label: 'خانواده', icon: UserGroupIcon },
    { path: '/messages', label: 'پیام‌ها', icon: ChatBubbleLeftRightIcon },
  ]

  const additionalMenuItems: MenuItem[] = [
    { path: '/profile', label: 'پروفایل من', icon: UserCircleIcon },
    { path: '/transactions', label: 'تراکنش‌ها', icon: ChartBarIcon },
    { label: 'تنظیمات', icon: Cog6ToothIcon, path: '/settings' },
    { label: 'حریم خصوصی', icon: ShieldCheckIcon, path: '/privacy' },
    { label: 'خروج از حساب', icon: ArrowRightOnRectangleIcon, action: handleLogout, color: 'text-red-600' },
  ]

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'کاربر'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      showHandleBar={true}
      maxHeight="90vh"
    >
      <div className="py-2" dir="rtl">
        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200"
        >
          {/* User Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-purple-100">
            <img 
              src="/avatar/a3efb9801a4b75deacd1d69995b3615a.jpg" 
              alt="آواتار کاربر"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {displayName}
            </h3>
            <p className="text-sm text-gray-600">
              {user?.email || user?.phone || 'ایمیل ثبت نشده'}
            </p>
          </div>
        </motion.div>

        {/* Main Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h4 className="text-xs font-semibold text-gray-500 mb-3 px-2">
            منوی اصلی
          </h4>
          <div className="space-y-1">
            {mainMenuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => item.path && handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200">
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <span className="text-base font-medium text-gray-900 group-hover:text-gray-900">
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Additional Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t border-gray-200"
        >
          <h4 className="text-xs font-semibold text-gray-500 mb-3 px-2">
            بیشتر
          </h4>
          <div className="space-y-1">
            {additionalMenuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => item.action ? item.action() : item.path && handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 group-hover:scale-110 transition-all duration-200 ${item.color === 'text-red-600' ? 'group-hover:bg-red-600' : ''}`}>
                    <Icon className={`w-5 h-5 ${item.color || 'text-gray-700'} group-hover:text-white transition-colors duration-200`} />
                  </div>
                  <span className={`text-base font-medium ${item.color || 'text-gray-900'} group-hover:text-gray-900 ${item.color === 'text-red-600' ? 'group-hover:text-red-600' : ''}`}>
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </Modal>
  )
}

export default MenuModal

