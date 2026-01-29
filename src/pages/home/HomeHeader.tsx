import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import MenuModal from '../../components/home/MenuModal'

function HomeHeader() {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [totalBalance, setTotalBalance] = useState<number>(0)

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
  // (moved to TopUserBar)

  return (
    <>
      <div className="px-6 bg-[#359C67] flex flex-col -mt-1 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between relative z-10 w-full h-full py-4"
        >
        {/* Balance Display - Center */}
        <div className="flex flex-col gap-2 pb-6 items-center text-center">
          <p className="text-white/70 text-sm font-medium">موجودی دیجی پی شما</p>
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

