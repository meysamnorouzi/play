import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import MenuModal from '../../components/home/MenuModal'
import { useAuth } from '../../context/AuthContext'

function HomeHeader() {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const { user } = useAuth()

  useEffect(() => {
    loadWalletBalance()
    
    // Listen for balance updates
    const handleBalanceUpdate = () => {
      loadWalletBalance()
    }
    
    window.addEventListener('balanceUpdated', handleBalanceUpdate)
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate)
  }, [])

  const loadWalletBalance = () => {
    // Load children
    const storedChildren = localStorage.getItem('childrenList')
    const parsedChildren = storedChildren ? JSON.parse(storedChildren) : []

    // Calculate total balance
    let total = 0

    if (parsedChildren.length > 0) {
      parsedChildren.forEach((child: any) => {
        // Get wallet balance
        const walletKey = `childWallet_${child.id}`
        const storedWallet = localStorage.getItem(walletKey)
        if (storedWallet) {
          const walletData = JSON.parse(storedWallet)
          total += walletData.balance || 0
        } else {
          // Create random balance if doesn't exist
          const randomBalance = Math.floor(Math.random() * 5000000) + 100000
          const walletData = { balance: randomBalance }
          localStorage.setItem(walletKey, JSON.stringify(walletData))
          total += randomBalance
        }
      })
    } else {
      // If no children, create a default balance
      total = Math.floor(Math.random() * 10000000) + 5000000
    }

    setTotalBalance(total)
  }

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('fa-IR').format(balance)
  }

  // Get user full name
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || 'کاربر میهمان'

  // Get user avatar
  const userAvatar = user?.avatar || '/avatar/a3efb9801a4b75deacd1d69995b3615a.jpg'

  return (
    <>
      <div className="px-6 h-48 bg-black flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between relative z-10 w-full h-full py-4"
        >
        {/* User Profile - Top Right */}
        <div className="flex items-center justify-between">
          {/* User Profile */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300"
            onClick={() => setIsMenuModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
              <img 
                src={userAvatar} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-base font-medium">{fullName}</p>
          </div>
          
          {/* Question Mark Icon */}
          <QuestionMarkCircleIcon 
            className="w-6 h-6 text-white/70 cursor-pointer hover:text-white hover:scale-110 transition-all duration-300"
          />
        </div>
        
        {/* Balance Display - Center */}
        <div className="flex flex-col gap-2 pb-6 items-center text-center">
          <p className="text-white/70 text-sm font-medium">موجودی کل</p>
          <div className="flex items-baseline gap-2 justify-center">
            <p className="text-white text-3xl font-bold">
              {formatBalance(totalBalance)}
            </p>
            <p className="text-white/70 text-base font-medium">تومان</p>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
      />
    </>
  )
}

export default HomeHeader

