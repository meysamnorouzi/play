import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineFileText, AiOutlineInbox, AiOutlineWallet, AiOutlineShopping, AiOutlineRest, AiOutlineUserAdd } from 'react-icons/ai'
import { BsFlag, BsPeople } from 'react-icons/bs'
import { UserGroupIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import TasksModal from '../../components/home/TasksModal'
import RequestsModal from '../../components/home/RequestsModal'
import HomeHeader from './HomeHeader'

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
  const navigate = useNavigate()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [activeChildId, setActiveChildId] = useState<string | null>(null)
  const [showTasksModal, setShowTasksModal] = useState(false)
  const [showRequestsModal, setShowRequestsModal] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [allowances, setAllowances] = useState<Allowance[]>([])
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
    const allAllowances: Allowance[] = []
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
      if (storedAllowance) {
        const parsedAllowance: Allowance = JSON.parse(storedAllowance)
        allAllowances.push(parsedAllowance)
      } else {
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
        allAllowances.push(sampleAllowance)
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
    setAllowances(allAllowances)
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
      setRequests(requests.filter(r => r.status === 'pending'))
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
      setRequests(mockRequests.filter(r => r.status === 'pending'))
    }

    setShowRequestsModal(true)
  }

  const toggleAllowance = (childId: string) => {
    const allowanceKey = `childAllowance_${childId}`
    const storedAllowance = localStorage.getItem(allowanceKey)
    if (storedAllowance) {
      const allowance: Allowance = JSON.parse(storedAllowance)
      allowance.isActive = !allowance.isActive
      localStorage.setItem(allowanceKey, JSON.stringify(allowance))
      setAllowances(prev => prev.map(a => a.childId === childId ? allowance : a))
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
    <div className="min-h-screen bg-black" dir="rtl">
      {/* Home Header */}
      <HomeHeader />
      
      <div className="bg-white min-h-screen px-4 py-6 max-w-4xl mx-auto rounded-t-3xl">
        {children.length > 0 ? (
          <div className="space-y-4">
            {/* Tabs for multiple children */}
            {children.length >= 2 && (
              <div className={`flex gap-2 pb-2 mb-4 ${children.length === 2 ? '' : 'overflow-x-auto scrollbar-hide'}`} style={children.length > 2 ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                {children.map((child, index) => (
                  <motion.button
                    key={child.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setActiveChildId(child.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                      children.length === 2 ? 'flex-1' : 'shrink-0'
                    } ${
                      activeChildId === child.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={child.avatar}
                        alt={`${child.firstName} ${child.lastName}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                      />
                      {child.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <span className="font-semibold text-sm">
                      {child.firstName} {child.lastName}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {childrenToDisplay.map((child) => {
              const { tasksCount, requestsCount } = getChildStats(child.id)
              const { activeCount, completedCount } = getTasksStats(child.id)
              const childGoals = goals.filter(g => g.childId === child.id)
              const childAllowance = allowances.find(a => a.childId === child.id)
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
                  {/* Child Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl p-5 border border-gray-200 transition-all"
                  >
                    {/* Top section: image and information */}
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={child.avatar}
                          alt={`${child.firstName} ${child.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        {child.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Information */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          موجودی: <span className="text-gray-900">{formatBalance(getChildWalletBalance(child.id))}</span> تومان
                        </p>
                      </div>
                    </div>

                    {/* Bottom section: task and request statistics */}
                    <div className="flex items-center gap-3">
                      {/* Task count */}
                      <button
                        onClick={(e) => handleTasksClick(child, e)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                      >
                        <AiOutlineFileText className="w-5 h-5" />
                        <span className="text-base">{tasksCount}</span>
                        <span className="text-sm opacity-90">تسک</span>
                      </button>

                      {/* Request count */}
                      <button
                        onClick={(e) => handleRequestsClick(child, e)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
                      >
                        <AiOutlineInbox className="w-5 h-5" />
                        <span className="text-base">{requestsCount}</span>
                        <span className="text-sm opacity-90">درخواست</span>
                      </button>
                    </div>
                  </motion.div>

                  {/* Additional Features - Compact Vertical Layout */}
                  <div className="flex flex-col gap-2">
                    {/* Saving Pot */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2"
                    >
                      <AiOutlineWallet className="w-5 h-5 text-gray-700 shrink-0" />
                      <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">پس‌انداز:</span>
                      <span className="text-xs font-bold text-gray-900">
                        {formatBalance(childGoals.reduce((sum, goal) => sum + goal.currentAmount, 0))} تومان
                      </span>
                    </motion.div>

                    {/* Goal Card */}
                    {childGoals.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2"
                      >
                        <div className="relative w-8 h-8 shrink-0">
                          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 64 64">
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
                            <span className="text-[10px] font-bold text-gray-700">
                              {Math.round((childGoals[0].currentAmount / childGoals[0].targetAmount) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-xs font-semibold text-gray-900 truncate">{childGoals[0].title}</span>
                          <span className="text-[10px] text-gray-500 shrink-0">
                            {formatBalance(childGoals[0].currentAmount)}/{formatBalance(childGoals[0].targetAmount)}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2"
                      >
                        <BsFlag className="w-5 h-5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 whitespace-nowrap">هدف جدید</span>
                      </motion.div>
                    )}

                    {/* Weekly Allowance */}
                    {childAllowance && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">حقوق هفتگی:</span>
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatBalance(childAllowance.amount)} تومان
                          </span>
                        </div>
                        <button
                          onClick={() => toggleAllowance(child.id)}
                          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                            childAllowance.isActive ? 'bg-black' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                              childAllowance.isActive ? '-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </motion.div>
                    )}

                    {/* Missions Summary */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2"
                    >
                      <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">مأموریت:</span>
                      <span className="text-xs text-gray-600 whitespace-nowrap">فعال {activeCount}</span>
                      <span className="text-xs text-gray-600 whitespace-nowrap">|</span>
                      <span className="text-xs text-gray-600 whitespace-nowrap">انجام شده {completedCount}</span>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  {childActivities.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                      <p className="text-sm font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</p>
                      <div className="space-y-3">
                        {childActivities.map((activity, index) => (
                          <motion.div 
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                            className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shrink-0">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              <p className="text-xs text-gray-500">{formatTime(activity.date)}</p>
                            </div>
                            <p className={`text-sm font-semibold shrink-0 ${activity.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                              {activity.type === 'expense' ? '-' : '+'} {formatBalance(activity.amount)} تومان
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
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                      <p className="text-sm font-semibold text-gray-900 mb-4">تسک‌های اخیر</p>
                      <div className="space-y-3">
                        {recentTasks.map((task, index) => (
                          <motion.div 
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                            className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-gray-700 shrink-0">
                              <AiOutlineFileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-1 truncate">{task.title}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs text-gray-500">{formatTime(task.date)}</p>
                                {getTaskStatusBadge(task.status)}
                                {task.points > 0 && (
                                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {task.points} پوینت
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
            className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4"
          >
            {/* Main Icon Container with Gradient Background */}
            <div className="relative mb-8">
              {/* Decorative Circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-60"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-xl opacity-50"></div>
              </div>
              
              {/* Main Icon */}
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <UserGroupIcon className="w-24 h-24 text-gray-400" />
              </div>
              
              {/* Floating Icons */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2 bg-white rounded-full p-2 border border-gray-200"
              >
                <BsPeople className="w-6 h-6 text-blue-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -bottom-2 -left-2 bg-white rounded-full p-2 border border-gray-200"
              >
                <AiOutlineUserAdd className="w-6 h-6 text-purple-500" />
              </motion.div>
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
              onClick={() => navigate('/children')}
              className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              <PlusCircleIcon className="w-6 h-6" />
              <span>افزودن فرزند</span>
            </motion.button>

            {/* Feature Icons Row */}
            <div className="mt-12 flex items-center gap-6 opacity-60">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-100 rounded-full p-3">
                  <AiOutlineWallet className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-gray-600 font-medium">پس‌انداز</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-100 rounded-full p-3">
                  <BsFlag className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-gray-600 font-medium">اهداف</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-100 rounded-full p-3">
                  <AiOutlineFileText className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-gray-600 font-medium">تسک‌ها</span>
              </div>
            </div>
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
      />
    </div>
  )
}

export default Home


