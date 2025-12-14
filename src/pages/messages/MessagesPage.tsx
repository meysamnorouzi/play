import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  WalletIcon,
  CheckCircleIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string;
  childId: string;
  childName: string;
  childAvatar: string;
  type: 'request' | 'transaction' | 'login' | 'task' | 'thanks' | 'activity';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  amount?: number;
  status?: 'pending' | 'approved' | 'rejected';
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isOnline?: boolean;
}

function MessagesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadActivities()
    
    // Reload activities when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadActivities()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadActivities = () => {
    // Load children
    const storedChildren = localStorage.getItem('childrenList')
    const parsedChildren: Child[] = storedChildren ? JSON.parse(storedChildren) : []
    setChildren(parsedChildren)

    const allActivities: Activity[] = []
    const now = Date.now()

    if (parsedChildren.length > 0) {
      parsedChildren.forEach((child, childIndex) => {
        const childName = `${child.firstName} ${child.lastName}`

        // Load requests
        const requestsKey = `childRequests_${child.id}`
        const storedRequests = localStorage.getItem(requestsKey)
        if (storedRequests) {
          const requests: any[] = JSON.parse(storedRequests)
          requests.forEach((request, index) => {
            allActivities.push({
              id: `request_${child.id}_${request.id}`,
              childId: child.id,
              childName,
              childAvatar: child.avatar,
              type: 'request',
              title: request.title,
              message: request.description || request.title,
              timestamp: request.date || now - (childIndex * 2 * 60 * 60 * 1000) - (index * 30 * 60 * 1000),
              isRead: request.status !== 'pending',
              status: request.status,
              amount: request.amount
            })
          })
        } else {
          // Create sample requests
          const sampleRequests = [
            {
              id: '1',
              title: 'درخواست خرید بازی',
              description: 'می‌خوام بازی جدید پلی‌استیشن رو بخرم',
              type: 'خرید',
              date: now - (childIndex * 2 * 60 * 60 * 1000) - 30 * 60 * 1000,
              status: 'pending' as const,
              amount: 1599000
            },
            {
              id: '2',
              title: 'درخواست افزایش موجودی',
              description: 'می‌خوام موجودی کیف پولم رو افزایش بدی',
              type: 'مالی',
              date: now - (childIndex * 2 * 60 * 60 * 1000) - 2 * 60 * 60 * 1000,
              status: 'pending' as const,
              amount: 500000
            }
          ]
          localStorage.setItem(requestsKey, JSON.stringify(sampleRequests))
          sampleRequests.forEach((request) => {
            allActivities.push({
              id: `request_${child.id}_${request.id}`,
              childId: child.id,
              childName,
              childAvatar: child.avatar,
              type: 'request',
              title: request.title,
              message: request.description,
              timestamp: request.date,
              isRead: false,
              status: request.status,
              amount: request.amount
            })
          })
        }

        // Load recent activities
        const activitiesKey = `childRecentActivities_${child.id}`
        const storedActivities = localStorage.getItem(activitiesKey)
        if (storedActivities) {
          const recentActivities: any[] = JSON.parse(storedActivities)
          recentActivities.slice(0, 3).forEach((activity, index) => {
            allActivities.push({
              id: `activity_${child.id}_${activity.id}`,
              childId: child.id,
              childName,
              childAvatar: child.avatar,
              type: 'transaction',
              title: activity.title,
              message: `${activity.title} - ${activity.type === 'expense' ? 'هزینه' : 'درآمد'}`,
              timestamp: activity.date || now - (childIndex * 3 * 60 * 60 * 1000) - (index * 60 * 60 * 1000),
              isRead: true,
              amount: activity.amount
            })
          })
        }

        // Add sample thanks message
        allActivities.push({
          id: `thanks_${child.id}`,
          childId: child.id,
          childName,
          childAvatar: child.avatar,
          type: 'thanks',
          title: 'تشکر',
          message: 'ممنون از واریز حقوق هفتگی 😊',
          timestamp: now - (childIndex * 4 * 60 * 60 * 1000),
          isRead: childIndex === 0 ? false : true
        })

        // Add sample task completion
        allActivities.push({
          id: `task_${child.id}`,
          childId: child.id,
          childName,
          childAvatar: child.avatar,
          type: 'task',
          title: 'تسک انجام شد',
          message: 'تسک "خرید کتاب درسی" رو انجام دادم!',
          timestamp: now - (childIndex * 5 * 60 * 60 * 1000),
          isRead: true
        })

        // Add sample login activity
        allActivities.push({
          id: `login_${child.id}`,
          childId: child.id,
          childName,
          childAvatar: child.avatar,
          type: 'login',
          title: 'ورود به اپلیکیشن',
          message: 'به اپلیکیشن وارد شد',
          timestamp: now - (childIndex * 6 * 60 * 60 * 1000),
          isRead: true
        })
      })
    }

    // Sort by timestamp (newest first)
    const sortedActivities = allActivities.sort((a, b) => b.timestamp - a.timestamp)
    setActivities(sortedActivities)
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) {
      return 'همین الان'
    }
    if (minutes < 60) {
      return `${minutes} دقیقه پیش`
    }
    if (hours < 24) {
      return `${hours} ساعت پیش`
    }
    const days = Math.floor(hours / 24)
    if (days === 1) return 'دیروز'
    if (days < 7) return `${days} روز پیش`
    return date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' })
  }

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('fa-IR').format(balance)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <ShoppingBagIcon className="w-5 h-5" />
      case 'transaction':
        return <WalletIcon className="w-5 h-5" />
      case 'task':
        return <CheckCircleIcon className="w-5 h-5" />
      case 'thanks':
        return <HeartIcon className="w-5 h-5" />
      case 'login':
        return <UserIcon className="w-5 h-5" />
      default:
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-blue-50 text-blue-600'
      case 'transaction':
        return 'bg-green-50 text-green-600'
      case 'task':
        return 'bg-purple-50 text-purple-600'
      case 'thanks':
        return 'bg-pink-50 text-pink-600'
      case 'login':
        return 'bg-gray-50 text-gray-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    
    switch (status) {
      case 'pending':
        return <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">در انتظار</span>
      case 'approved':
        return <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">تأیید شده</span>
      case 'rejected':
        return <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">رد شده</span>
      default:
        return null
    }
  }

  const filteredActivities = activities.filter(activity =>
    activity.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = activities.filter(a => !a.isRead).length

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {children.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-4"
          >
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              هنوز فرزندی اضافه نشده
            </h3>
            <p className="text-gray-500 text-sm">
              برای مشاهده درخواست‌ها و فعالیت‌ها، ابتدا فرزند خود را اضافه کنید
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white min-h-screen px-4 py-6 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">درخواست‌ها و فعالیت‌ها</h1>
              {unreadCount > 0 && (
                <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {unreadCount} خوانده نشده
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">درخواست‌ها و فعالیت‌های فرزندان شما</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی درخواست‌ها و فعالیت‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
            </div>
          </motion.div>

          {/* Activities List */}
          {filteredActivities.length > 0 ? (
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                className={`bg-white rounded-xl p-4 border border-gray-200 hover:bg-gray-50 transition-colors ${
                  !activity.isRead ? 'border-l-4 border-l-black' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={activity.childAvatar}
                      alt={activity.childName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900">
                            {activity.childName}
                          </h3>
                          {!activity.isRead && (
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {activity.title}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-gray-500">
                          {formatTime(activity.timestamp)}
                        </span>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.message}
                    </p>
                    {activity.amount && (
                      <p className="text-xs text-gray-500">
                        مبلغ: <span className="font-semibold text-gray-900">{formatBalance(activity.amount)}</span> تومان
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز فعالیتی وجود ندارد'}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery 
                  ? 'لطفاً کلمه دیگری را جستجو کنید'
                  : 'درخواست‌ها و فعالیت‌های فرزندان شما اینجا نمایش داده می‌شود'}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default MessagesPage
