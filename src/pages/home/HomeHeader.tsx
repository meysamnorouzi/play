import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import MenuModal from '../../components/home/MenuModal'

const DICHI_P_BALANCE_KEY = 'dichiPBalance'
const DEFAULT_BALANCE = 12000000

function HomeHeader() {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [totalBalance, setTotalBalance] = useState<number>(() => {
    const stored = localStorage.getItem(DICHI_P_BALANCE_KEY)
    if (stored !== null) {
      const n = parseInt(stored, 10)
      if (!Number.isNaN(n)) return n
    }
    return DEFAULT_BALANCE
  })

  useEffect(() => {
    loadWalletBalance()

    const handleBalanceUpdate = () => {
      loadWalletBalance()
    }

    window.addEventListener('balanceUpdated', handleBalanceUpdate)
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate)
  }, [])

  const loadWalletBalance = () => {
    const stored = localStorage.getItem(DICHI_P_BALANCE_KEY)
    if (stored !== null) {
      const n = parseInt(stored, 10)
      if (!Number.isNaN(n)) {
        setTotalBalance(n)
        return
      }
    }
    localStorage.setItem(DICHI_P_BALANCE_KEY, String(DEFAULT_BALANCE))
    setTotalBalance(DEFAULT_BALANCE)
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

