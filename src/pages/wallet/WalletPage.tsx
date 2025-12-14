import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { 
  WalletIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { 
  AiOutlineWallet, 
  AiOutlineShopping, 
  AiOutlineRest,
  AiOutlineArrowDown
} from 'react-icons/ai'

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Activity {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  date: number;
  icon: string;
  childId: string;
}

function WalletPage() {
  const { user } = useAuth()
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [children, setChildren] = useState<Child[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    transactionsCount: 0
  })

  // Get account owner name
  const accountOwnerName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'کاربر'

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = () => {
    // Load children
    const storedChildren = localStorage.getItem('childrenList')
    const parsedChildren: Child[] = storedChildren ? JSON.parse(storedChildren) : []
    setChildren(parsedChildren)

    // Calculate total balance
    let total = 0
    const allActivities: Activity[] = []

    if (parsedChildren.length > 0) {
      parsedChildren.forEach((child) => {
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

        // Load activities from childRecentActivities
        const recentActivitiesKey = `childRecentActivities_${child.id}`
        const storedRecentActivities = localStorage.getItem(recentActivitiesKey)
        let hasActivities = false
        
        if (storedRecentActivities) {
          try {
            const activities: Activity[] = JSON.parse(storedRecentActivities)
            if (activities && Array.isArray(activities) && activities.length > 0) {
              hasActivities = true
              activities.forEach(activity => {
                allActivities.push({
                  ...activity,
                  childId: child.id
                })
              })
            }
          } catch (e) {
            console.error('Error parsing activities:', e)
          }
        }

        // Always create sample activities if doesn't exist or is empty
        // This ensures there's always data to display
        if (!hasActivities) {
          const now = Date.now()
          const sampleActivities: Activity[] = [
            {
              id: `activity_${child.id}_1`,
              title: 'فروشگاه پلی‌استیشن',
              amount: 1599000,
              type: 'expense',
              date: now - 2 * 60 * 60 * 1000, // 2 hours ago
              icon: 'game',
              childId: child.id
            },
            {
              id: `activity_${child.id}_2`,
              title: 'مک‌دونالد',
              amount: 850000,
              type: 'expense',
              date: now - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000, // Yesterday
              icon: 'food',
              childId: child.id
            },
            {
              id: `activity_${child.id}_3`,
              title: 'واریز حقوق هفتگی',
              amount: 1000000,
              type: 'income',
              date: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
              icon: 'wallet',
              childId: child.id
            },
            {
              id: `activity_${child.id}_4`,
              title: 'خرید کتاب',
              amount: 450000,
              type: 'expense',
              date: now - 5 * 24 * 60 * 60 * 1000, // 5 days ago
              icon: 'wallet',
              childId: child.id
            },
            {
              id: `activity_${child.id}_5`,
              title: 'پاداش انجام تسک',
              amount: 500000,
              type: 'income',
              date: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              icon: 'wallet',
              childId: child.id
            }
          ]
          localStorage.setItem(recentActivitiesKey, JSON.stringify(sampleActivities))
          sampleActivities.forEach(activity => {
            allActivities.push(activity)
          })
        }

        // Also load from childActivities (tasks/activities)
        const activitiesKey = `childActivities_${child.id}`
        const storedActivities = localStorage.getItem(activitiesKey)
        if (storedActivities) {
          const activities: any[] = JSON.parse(storedActivities)
          // Convert tasks to activities format if needed
          activities.forEach((activity: any) => {
            if (activity.status === 'completed' && activity.points) {
              allActivities.push({
                id: `task_${activity.id}`,
                title: `پاداش: ${activity.title}`,
                amount: activity.points * 10000, // Convert points to money
                type: 'income' as const,
                date: activity.date || Date.now(),
                icon: 'wallet',
                childId: child.id
              })
            }
          })
        }
      })
    } else {
      // If no children, create a default balance and sample activities
      total = Math.floor(Math.random() * 10000000) + 5000000
      const now = Date.now()
      const defaultActivities: Activity[] = [
        {
          id: 'default_activity_1',
          title: 'واریز اولیه',
          amount: 2000000,
          type: 'income',
          date: now - 1 * 24 * 60 * 60 * 1000,
          icon: 'wallet',
          childId: 'default'
        },
        {
          id: 'default_activity_2',
          title: 'خرید آنلاین',
          amount: 750000,
          type: 'expense',
          date: now - 3 * 24 * 60 * 60 * 1000,
          icon: 'wallet',
          childId: 'default'
        },
        {
          id: 'default_activity_3',
          title: 'پرداخت قبوض',
          amount: 1200000,
          type: 'expense',
          date: now - 5 * 24 * 60 * 60 * 1000,
          icon: 'wallet',
          childId: 'default'
        }
      ]
      defaultActivities.forEach(activity => {
        allActivities.push(activity)
      })
    }

    setTotalBalance(total)

    // Sort activities by date and get recent 10
    const sortedActivities = allActivities.sort((a, b) => b.date - a.date).slice(0, 10)
    setRecentActivities(sortedActivities)

    // Calculate stats from all activities (not just recent 10)
    const allSortedActivities = allActivities.sort((a, b) => b.date - a.date)
    const income = allSortedActivities
      .filter(a => a.type === 'income')
      .reduce((sum, a) => sum + a.amount, 0)
    
    const expense = allSortedActivities
      .filter(a => a.type === 'expense')
      .reduce((sum, a) => sum + a.amount, 0)

    setStats({
      totalIncome: income,
      totalExpense: expense,
      transactionsCount: allSortedActivities.length
    })
  }

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('fa-IR').format(balance)
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return minutes < 1 ? 'همین الان' : `${minutes} دقیقه پیش`
      }
      return `${hours} ساعت پیش`
    }
    const days = Math.floor(hours / 24)
    if (days === 1) return 'دیروز'
    if (days < 7) return `${days} روز پیش`
    return date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' })
  }

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'game':
        return <AiOutlineShopping className="w-5 h-5" />
      case 'food':
        return <AiOutlineRest className="w-5 h-5" />
      default:
        return <AiOutlineWallet className="w-5 h-5" />
    }
  }

  const getChildName = (childId: string): string => {
    if (childId === 'default') return 'حساب اصلی'
    const child = children.find(c => c.id === childId)
    return child ? `${child.firstName} ${child.lastName}` : 'نامشخص'
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white min-h-screen px-4 py-6 max-w-4xl mx-auto">
        {/* Main Balance Card */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-black rounded-2xl p-6 overflow-hidden aspect-video"
          >
            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Balance Display - Center */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-4xl font-bold mb-1">
                    {formatBalance(totalBalance)}
                  </p>
                  <p className="text-white/70 text-sm font-medium">تومان</p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-end justify-between mt-auto">
                {/* Left Side - Account Owner */}
                <div>
                  <p className="text-white/70 text-xs font-medium mb-1">صاحب حساب</p>
                  <p className="text-white text-sm font-semibold">{accountOwnerName}</p>
                </div>

                {/* Right Side - Card Number */}
                <div className="text-left">
                  <p className="text-white text-sm font-semibold tracking-wider">
                    •••• •••• •••• 1214
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4 mb-4">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>برداشت</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>واریز</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-50 rounded-lg p-2">
                <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs text-gray-600 font-medium">هزینه</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatBalance(stats.totalExpense)}
            </p>
            <p className="text-xs text-gray-500 mt-1">تومان</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-50 rounded-lg p-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600 font-medium">تراکنش</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {stats.transactionsCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">مورد</p>
          </motion.div>
        </div>

        {/* Children Wallets Summary */}
        {children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 bg-white rounded-xl p-5 border border-gray-200"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">کیف پول فرزندان</h2>
            <div className="space-y-3">
              {children.map((child) => {
                const walletKey = `childWallet_${child.id}`
                const storedWallet = localStorage.getItem(walletKey)
                const balance = storedWallet 
                  ? JSON.parse(storedWallet).balance || 0 
                  : 0

                return (
                  <div
                    key={child.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={child.avatar}
                      alt={`${child.firstName} ${child.lastName}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">موجودی کیف پول</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {formatBalance(balance)}
                      </p>
                      <p className="text-xs text-gray-500">تومان</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">تراکنش‌های اخیر</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              مشاهده همه
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'income' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {activity.type === 'income' ? (
                      <AiOutlineArrowDown className="w-6 h-6" />
                    ) : (
                      getActivityIcon(activity.icon)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{getChildName(activity.childId)}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{formatTime(activity.date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-left shrink-0">
                    <p className={`text-sm font-bold ${
                      activity.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {activity.type === 'income' ? '+' : '-'} {formatBalance(activity.amount)}
                    </p>
                    <p className="text-xs text-gray-500">تومان</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <WalletIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">هنوز تراکنشی ثبت نشده است</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default WalletPage
