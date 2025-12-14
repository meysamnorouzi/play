import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  WalletIcon, 
  Squares2X2Icon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { path: '/', label: 'خانه', icon: HomeIcon },
  { path: '/wallet', label: 'کیف پول', icon: WalletIcon },
  { path: '/categories', label: 'آکادمی', icon: Squares2X2Icon },
  { path: '/children', label: 'خانواده', icon: UserGroupIcon },
  { path: '/messages', label: 'پیام‌ها', icon: ChatBubbleLeftRightIcon },
]

function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-6 pt-3" dir="rtl">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-2 px-4 py-2 transition-all duration-300"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30
                  }}
                />
              )}
              <motion.div
                animate={active ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                } : {
                  scale: 1,
                  rotate: 0
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`} />
              </motion.div>
              {active && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium text-white relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation

