import { useState, useEffect } from 'react'
import { AiOutlineFileText, AiOutlineInbox, AiOutlineWallet, AiOutlineShopping, AiOutlineRest } from 'react-icons/ai'
import { BsFlag } from 'react-icons/bs'
import { PlusCircleIcon, CurrencyDollarIcon, WalletIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import TasksModal from '../../components/home/TasksModal'
import RequestsModal from '../../components/home/RequestsModal'
import AddChildModal from '../../components/children/AddChildModal'
import HomeHeader from './HomeHeader'
import { toPersianNumber } from '../../utils/numberUtils'

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  password: string;
  birthDate: string;
  avatar: string;
  isOnline?: boolean;
  onlineSince?: number;
  lastOnlineTime?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  date: number;
  duration: number;
  status: 'completed' | 'pending' | 'in-progress';
  points: number;
}

interface Request {
  id: string;
  title: string;
  description: string;
  type: string;
  date: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface Goal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  childId: string;
}

interface Allowance {
  childId: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  isActive: boolean;
  nextPayout: number;
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

function Home() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Load children list from localStorage
    const storedChildren = localStorage.getItem('childrenList')
    if (storedChildren) {
      const parsedChildren = JSON.parse(storedChildren)
      setChildren(parsedChildren)

      // Set first child as active if there are 2 or more children
      if (parsedChildren.length >= 2 && parsedChildren.length > 0) {
        setActiveChildId(parsedChildren[0].id)
      }

      // Load goals, allowances, and activities for all children
      loadAdditionalData(parsedChildren)
    }
  }, [])

  const loadAdditionalData = (childrenList: Child[]) => {
    const allGoals: Goal[] = []
    const allActivities: Activity[] = []

    childrenList.forEach((child) => {
      // Load goals if not exist create sample goal
      const goalsKey = `childGoals_${child.id}`
      const storedGoals = localStorage.getItem(goalsKey)
      if (storedGoals) {
        const parsedGoals: Goal[] = JSON.parse(storedGoals)
        allGoals.push(...parsedGoals)
      } else {
        // Create sample goal
        const sampleGoal: Goal = {
          id: `goal_${child.id}_1`,
          title: 'دوچرخه جدید',
          currentAmount: 8000000, // 80,000 Toman
          targetAmount: 12000000, // 120,000 Toman
          childId: child.id
        }
        localStorage.setItem(goalsKey, JSON.stringify([sampleGoal]))
        allGoals.push(sampleGoal)
      }

      // Load allowances
      const allowanceKey = `childAllowance_${child.id}`
      const storedAllowance = localStorage.getItem(allowanceKey)
      if (!storedAllowance) {
        // Create sample allowance
        const nextFriday = new Date()
        nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7)
        const sampleAllowance: Allowance = {
          childId: child.id,
          amount: 1000000, // 10,000 Toman
          frequency: 'weekly',
          isActive: true,
          nextPayout: nextFriday.getTime()
        }
        localStorage.setItem(allowanceKey, JSON.stringify(sampleAllowance))
      }

      // Load activities
      const activitiesKey = `childRecentActivities_${child.id}`
      const storedActivities = localStorage.getItem(activitiesKey)
      if (storedActivities) {
        const parsedActivities: Activity[] = JSON.parse(storedActivities)
        allActivities.push(...parsedActivities)
      } else {
        // Create sample activities
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
            date: now - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000, // Yesterday 5:45 PM
            icon: 'food',
            childId: child.id
          }
        ]
        localStorage.setItem(activitiesKey, JSON.stringify(sampleActivities))
        allActivities.push(...sampleActivities)
      }
    })

    setGoals(allGoals)
    setActivities(allActivities.sort((a, b) => b.date - a.date))
  }

  // Get child wallet balance
  const getChildWalletBalance = (childId: string): number => {
    const walletKey = `childWallet_${childId}`
    const storedWallet = localStorage.getItem(walletKey)
    if (storedWallet) {
      const walletData = JSON.parse(storedWallet)
      return walletData.balance || 0
    } else {
      // If balance doesn't exist, create a random balance
      const randomBalance = Math.floor(Math.random() * 5000000) + 100000 // Between 100,000 and 5,100,000
      const walletData = { balance: randomBalance }
      localStorage.setItem(walletKey, JSON.stringify(walletData))
      return randomBalance
    }
  }

  // Format balance as Toman
  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('fa-IR').format(balance)
  }

  // Get tasks stats for a child
  const getTasksStats = (childId: string) => {
    const activitiesKey = `childActivities_${childId}`
    const storedActivities = localStorage.getItem(activitiesKey)
    let activeCount = 0
    let completedCount = 0

    if (storedActivities) {
      const activities: Task[] = JSON.parse(storedActivities)
      activeCount = activities.filter(a => a.status === 'pending' || a.status === 'in-progress').length
      completedCount = activities.filter(a => a.status === 'completed').length
    }

    return { activeCount, completedCount }
  }

  // Calculate number of tasks and requests for a child
  const getChildStats = (childId: string) => {
    // Load tasks (activities)
    const activitiesKey = `childActivities_${childId}`
    const storedActivities = localStorage.getItem(activitiesKey)
    let tasksCount = 0
    if (storedActivities) {
      const activities: Task[] = JSON.parse(storedActivities)
      // Add points to tasks that don't have points
      const activitiesWithPoints = activities.map(task => ({
        ...task,
        points: task.points || 0
      }))
      // Save again with points
      localStorage.setItem(activitiesKey, JSON.stringify(activitiesWithPoints))
      // Count of pending and in-progress tasks
      tasksCount = activitiesWithPoints.filter(a => a.status === 'pending' || a.status === 'in-progress').length
    } else {
      // If no tasks exist, create sample data
      const now = Date.now()
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'خرید کتاب درسی',
          description: 'خرید کتاب ریاضی و علوم برای ترم جدید',
          category: 'خرید',
          date: now - 1 * 24 * 60 * 60 * 1000,
          duration: 45,
          status: 'pending',
          points: 50
        },
        {
          id: '2',
          title: 'پرداخت شهریه کلاس',
          description: 'پرداخت شهریه کلاس زبان انگلیسی',
          category: 'پرداخت',
          date: now - 2 * 24 * 60 * 60 * 1000,
          duration: 20,
          status: 'in-progress',
          points: 75
        },
        {
          id: '3',
          title: 'خرید لوازم تحریر',
          description: 'خرید دفتر، مداد و خودکار',
          category: 'خرید',
          date: now - 3 * 24 * 60 * 60 * 1000,
          duration: 30,
          status: 'pending',
          points: 30
        },
        {
          id: '4',
          title: 'واریز وجه به کیف پول',
          description: 'واریز وجه برای خرید اینترنتی',
          category: 'واریز',
          date: now - 4 * 24 * 60 * 60 * 1000,
          duration: 10,
          status: 'completed',
          points: 25
        },
        {
          id: '5',
          title: 'خرید اسباب بازی',
          description: 'خرید یک اسباب بازی از فروشگاه',
          category: 'خرید',
          date: now - 5 * 24 * 60 * 60 * 1000,
          duration: 25,
          status: 'completed',
          points: 40
        }
      ]
      localStorage.setItem(activitiesKey, JSON.stringify(mockTasks))
      tasksCount = mockTasks.filter(a => a.status === 'pending' || a.status === 'in-progress').length
    }

    // Load requests
    const requestsKey = `childRequests_${childId}`
    const storedRequests = localStorage.getItem(requestsKey)
    let requestsCount = 0
    if (storedRequests) {
      const requests: Request[] = JSON.parse(storedRequests)
      // Count of pending requests
      requestsCount = requests.filter(r => r.status === 'pending').length
    } else {
      // If no requests exist, create sample data
      const mockRequests: Request[] = [
        {
          id: '1',
          title: 'درخواست افزایش موجودی',
          description: 'درخواست افزایش موجودی کیف پول به مبلغ ۵۰۰,۰۰۰ تومان',
          type: 'مالی',
          date: Date.now() - 2 * 24 * 60 * 60 * 1000,
          status: 'pending'
        },
        {
          id: '2',
          title: 'درخواست خرید بازی',
          description: 'درخواست خرید بازی جدید',
          type: 'خرید',
          date: Date.now() - 1 * 24 * 60 * 60 * 1000,
          status: 'pending'
        }
      ]
      localStorage.setItem(requestsKey, JSON.stringify(mockRequests))
      requestsCount = mockRequests.filter(r => r.status === 'pending').length
    }

    return { tasksCount, requestsCount }
  }

  const handleTasksClick = (child: Child, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedChild(child)

    // Load tasks
    const activitiesKey = `childActivities_${child.id}`
    const storedActivities = localStorage.getItem(activitiesKey)
    if (storedActivities) {
      const activities: Task[] = JSON.parse(storedActivities)
      // Add points to tasks that don't have points
      const activitiesWithPoints = activities.map(task => ({
        ...task,
        points: task.points || 0
      }))
      setTasks(activitiesWithPoints.filter(a => a.status === 'pending' || a.status === 'in-progress'))
    } else {
      // If no tasks exist, create sample data
      const now = Date.now()
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'خرید کتاب درسی',
          description: 'خرید کتاب ریاضی و علوم برای ترم جدید',
          category: 'خرید',
          date: now - 1 * 24 * 60 * 60 * 1000,
          duration: 45,
          status: 'pending',
          points: 50
        },
        {
          id: '2',
          title: 'پرداخت شهریه کلاس',
          description: 'پرداخت شهریه کلاس زبان انگلیسی',
          category: 'پرداخت',
          date: now - 2 * 24 * 60 * 60 * 1000,
          duration: 20,
          status: 'in-progress',
          points: 75
        },
        {
          id: '3',
          title: 'خرید لوازم تحریر',
          description: 'خرید دفتر، مداد و خودکار',
          category: 'خرید',
          date: now - 3 * 24 * 60 * 60 * 1000,
          duration: 30,
          status: 'pending',
          points: 30
        },
        {
          id: '4',
          title: 'واریز وجه به کیف پول',
          description: 'واریز وجه برای خرید اینترنتی',
          category: 'واریز',
          date: now - 4 * 24 * 60 * 60 * 1000,
          duration: 10,
          status: 'completed',
          points: 25
        },
        {
          id: '5',
          title: 'خرید اسباب بازی',
          description: 'خرید یک اسباب بازی از فروشگاه',
          category: 'خرید',
          date: now - 5 * 24 * 60 * 60 * 1000,
          duration: 25,
          status: 'completed',
          points: 40
        }
      ]
      localStorage.setItem(activitiesKey, JSON.stringify(mockTasks))
      setTasks(mockTasks.filter(a => a.status === 'pending' || a.status === 'in-progress'))
    }

    setShowTasksModal(true)
  }

  const handleRequestsClick = (child: Child, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedChild(child)

    // Load requests
    const requestsKey = `childRequests_${child.id}`
    const storedRequests = localStorage.getItem(requestsKey)
    if (storedRequests) {
      const requests: Request[] = JSON.parse(storedRequests)
      // Show all requests, sorted by date (newest first)
      setRequests(requests.sort((a, b) => b.date - a.date))
    } else {
      // Create sample data
      const mockRequests: Request[] = [
        {
          id: '1',
          title: 'درخواست افزایش موجودی',
          description: 'درخواست افزایش موجودی کیف پول به مبلغ ۵۰۰,۰۰۰ تومان',
          type: 'مالی',
          date: Date.now() - 2 * 24 * 60 * 60 * 1000,
          status: 'pending'
        },
        {
          id: '2',
          title: 'درخواست خرید بازی',
          description: 'درخواست خرید بازی جدید',
          type: 'خرید',
          date: Date.now() - 1 * 24 * 60 * 60 * 1000,
          status: 'pending'
        }
      ]
      localStorage.setItem(requestsKey, JSON.stringify(mockRequests))
      setRequests(mockRequests.sort((a, b) => b.date - a.date))
    }

    setShowRequestsModal(true)
  }

  const handleApproveRequest = (requestId: string) => {
    if (!selectedChild) return

    const requestsKey = `childRequests_${selectedChild.id}`
    const storedRequests = localStorage.getItem(requestsKey)

    if (storedRequests) {
      const allRequests: Request[] = JSON.parse(storedRequests)
      const updatedRequests = allRequests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
      localStorage.setItem(requestsKey, JSON.stringify(updatedRequests))
      // Update state to show all requests, sorted by date
      setRequests(updatedRequests.sort((a, b) => b.date - a.date))
    }
  }

  const handleRejectRequest = (requestId: string) => {
    if (!selectedChild) return

    const requestsKey = `childRequests_${selectedChild.id}`
    const storedRequests = localStorage.getItem(requestsKey)

    if (storedRequests) {
      const allRequests: Request[] = JSON.parse(storedRequests)
      const updatedRequests = allRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
      localStorage.setItem(requestsKey, JSON.stringify(updatedRequests))
      // Update state to show all requests, sorted by date
      setRequests(updatedRequests.sort((a, b) => b.date - a.date))
    }
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 24) {
      if (hours === 0) {
        return `امروز، ${date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
      }
      return `دیروز، ${date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' })
  }

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'game':
        return <AiOutlineShopping className="w-6 h-6" />
      case 'food':
        return <AiOutlineRest className="w-6 h-6" />
      default:
        return <AiOutlineWallet className="w-6 h-6" />
    }
  }

  const getRecentTasks = (childId: string): Task[] => {
    const activitiesKey = `childActivities_${childId}`
    const storedActivities = localStorage.getItem(activitiesKey)
    if (storedActivities) {
      const activities: Task[] = JSON.parse(storedActivities)
      // Return recent tasks (last 3, sorted by date)
      return activities
        .sort((a, b) => b.date - a.date)
        .slice(0, 3)
    }
    return []
  }

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">انجام شده</span>
      case 'in-progress':
        return <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">در حال انجام</span>
      default:
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">در انتظار</span>
    }
  }

  // Get children to display (filtered by activeChildId if tabs are shown)
  const childrenToDisplay = children.length >= 2 && activeChildId
    ? children.filter(child => child.id === activeChildId)
    : children

  return (
    <div className="p-0" dir="rtl">
      {/* Home Header */}
      <HomeHeader />

      <div className="bg-white px-4 py-6 rounded-t-3xl -mt-10">
        {children.length > 0 ? (
          <div className="space-y-4">
            {/* Children Cards for multiple children */}
            {children.length >= 1 && (
              <div
                className="flex gap-8 mb-4 overflow-x-auto scrollbar-hide p-2"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {children.map((child, index) => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setActiveChildId(child.id)}
                    className={`relative bg-gradient-to-br from-[#359C67] via-[#359C67] to-[#2E7D5A] rounded-3xl p-5 shadow-2xl overflow-hidden transition-all cursor-pointer flex-shrink-0 ${activeChildId === child.id
                      ? 'ring-4 ring-[#81C784] ring-offset-2'
                      : 'opacity-90'
                      }`}
                    style={{
                      width: children.length === 1 ? '100%' : '90%',
                      scrollSnapAlign: 'start'
                    }}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>

                    <div className="relative z-10">
                      {/* Top Section */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                            <img
                              src={child.avatar}
                              alt={`${child.firstName} ${child.lastName}`}
                              className="relative w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
                            />
                          </div>
                          <div>
                            <h4 className="text-white text-base font-bold truncate mb-0.5">
                              {child.firstName} {child.lastName}
                            </h4>
                            <div className="flex items-center gap-1">
                              <WalletIcon className="w-3.5 h-3.5 text-white/70" />
                              <p className="text-white/70 text-xs">کیف پول</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Balance Display */}
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <p className="text-white/70 text-xs text-center mb-2">موجودی</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-white text-2xl font-bold">
                            {formatBalance(getChildWalletBalance(child.id))}
                          </p>
                          <p className="text-white/70 text-sm font-medium">تومان</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {childrenToDisplay.map((child) => {
              const { tasksCount, requestsCount } = getChildStats(child.id)
              const { activeCount, completedCount } = getTasksStats(child.id)
              const childGoals = goals.filter(g => g.childId === child.id)
              const childActivities = activities.filter(a => a.childId === child.id).slice(0, 5)
              const recentTasks = getRecentTasks(child.id)

              return (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Child Info Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="my-8"
                  >
                    {/* Child Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={child.avatar}
                          alt={`${child.firstName} ${child.lastName}`}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {child.firstName} {child.lastName}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom section: task and request statistics */}
                    <div className="flex items-center gap-3">
                      {/* Task count */}
                      <button
                        onClick={(e) => handleTasksClick(child, e)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#359C67] text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-sm"
                      >
                        <AiOutlineFileText className="w-5 h-5" />
                        <span className="text-base">{toPersianNumber(tasksCount)}</span>
                        <span className="text-sm opacity-90">ماموریت</span>
                      </button>

                      {/* Request count */}
                      <button
                        onClick={(e) => handleRequestsClick(child, e)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#359C67] text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-sm"
                      >
                        <AiOutlineInbox className="w-5 h-5" />
                        <span className="text-base">{toPersianNumber(requestsCount)}</span>
                        <span className="text-sm opacity-90">درخواست</span>
                      </button>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {/* Saving Pot */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-[#C8E6C9] rounded-xl flex items-center justify-center mb-2">
                          <AiOutlineWallet className="w-6 h-6 text-[#359C67]" />
                        </div>
                        <p className="text-gray-500 text-xs mb-1">پس‌انداز</p>
                        <p className="text-gray-900 text-sm font-bold">
                          {formatBalance(childGoals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
                        </p>
                      </div>
                    </motion.div>

                    {/* Goal Card */}
                    {childGoals.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="relative w-12 h-12 mb-2">
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 64 64">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#e5e7eb"
                                strokeWidth="6"
                                fill="none"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="#3b82f6"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${Math.min((childGoals[0].currentAmount / childGoals[0].targetAmount) * 175.9, 175.9)} 175.9`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">
                                {toPersianNumber(Math.round((childGoals[0].currentAmount / childGoals[0].targetAmount) * 100))}%
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-xs mb-1 truncate w-full">{childGoals[0].title}</p>
                          <p className="text-gray-900 text-xs font-bold">
                            {formatBalance(childGoals[0].currentAmount)}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                            <BsFlag className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-xs">هدف جدید</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Missions Summary */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                          <AiOutlineFileText className="w-6 h-6 text-green-700" />
                        </div>
                        <p className="text-gray-500 text-xs mb-1">مأموریت</p>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-gray-900 text-xs font-bold">فعال: {toPersianNumber(activeCount)}</span>
                          <span className="text-gray-600 text-xs">انجام: {toPersianNumber(completedCount)}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  {childActivities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">فعالیت‌های اخیر</h3>
                        <span className="text-xs text-gray-500">{toPersianNumber(childActivities.length)} مورد</span>
                      </div>
                      <div className="space-y-3">
                        {childActivities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activity.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                              }`}>
                              <div className={activity.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                                {getActivityIcon(activity.icon)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate mb-1">{activity.title}</p>
                              <p className="text-xs text-gray-500">{formatTime(activity.date)}</p>
                            </div>
                            <p className={`text-base font-bold shrink-0 ${activity.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                              {activity.type === 'expense' ? '-' : '+'} {formatBalance(activity.amount)}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Recent Tasks */}
                  {recentTasks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">ماموریت‌های اخیر</h3>
                        <span className="text-xs text-gray-500">{toPersianNumber(recentTasks.length)} مورد</span>
                      </div>
                      <div className="space-y-3">
                        {recentTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-12 h-12 bg-[#C8E6C9] rounded-xl flex items-center justify-center text-[#359C67] shrink-0">
                              <AiOutlineFileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 mb-2 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs text-gray-500">{formatTime(task.date)}</p>
                                {getTaskStatusBadge(task.status)}
                                {task.points > 0 && (
                                  <span className="text-xs text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 px-2 py-1 rounded-lg border border-yellow-200 flex items-center gap-1 font-semibold">
                                    <CurrencyDollarIcon className="w-3 h-3" />
                                    {toPersianNumber(task.points)} دیجیت
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center pt-10 px-4"
          >
            {/* Main Icon Container with Gradient Background */}
            <div className='w-full mb-4 flex items-center justify-center'>
              <img src="/icon/Parent_add_child.gif" alt="" className='w-[70%]' />
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                هنوز فرزندی اضافه نشده است
              </h3>
              <p className="text-gray-600 text-base max-w-sm leading-relaxed">
                برای شروع، اولین فرزند خود را اضافه کنید و مدیریت مالی او را آغاز کنید
              </p>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddChildModal(true)}
              className="flex items-center gap-2 bg-[#359C67] text-white px-14 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              <PlusCircleIcon className="w-6 h-6" />
              <span>افزودن فرزند</span>
            </motion.button>


          </motion.div>
        )}
      </div>

      {/* Tasks modal */}
      <TasksModal
        isOpen={showTasksModal}
        onClose={() => setShowTasksModal(false)}
        child={selectedChild}
        tasks={tasks}
      />

      {/* Requests modal */}
      <RequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        child={selectedChild}
        requests={requests}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* Add child modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onAdd={(childData) => {
          const now = Date.now();
          const isOnline = Math.random() > 0.5;

          const newChild: Child = {
            id: Date.now().toString(),
            ...childData,
            password: '',
            isOnline,
            onlineSince: isOnline ? now : undefined,
            lastOnlineTime: isOnline ? undefined : now - Math.random() * 24 * 60 * 60 * 1000,
          };

          const updatedChildren = [...children, newChild];
          setChildren(updatedChildren);
          localStorage.setItem('childrenList', JSON.stringify(updatedChildren));

          // Load additional data for the new child
          loadAdditionalData([newChild]);

          // If this is the first child or second child, set as active
          if (updatedChildren.length >= 2 && !activeChildId) {
            setActiveChildId(newChild.id);
          }
        }}
      />
    </div>
  )
}

export default Home


