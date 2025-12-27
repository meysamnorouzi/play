import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CheckCircleIcon,
  WalletIcon,
  TrophyIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { AiOutlineFileText, AiOutlineWallet, AiOutlineShopping } from 'react-icons/ai';
import { BsPiggyBank, BsFlag } from 'react-icons/bs';
import Modal from '../../components/Modal';

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

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: number;
  duration: number; // in minutes
  status: 'completed' | 'pending' | 'in-progress';
  points?: number;
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

function ChildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [allowance, setAllowance] = useState<Allowance | null>(null);
  const [tasksStats, setTasksStats] = useState({ active: 0, completed: 0, pending: 0 });
  const [definedTasks, setDefinedTasks] = useState<any[]>([]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletActivities, setWalletActivities] = useState<any[]>([]);
  const [showCompletedTasksModal, setShowCompletedTasksModal] = useState(false);

  // Create or load activities
  useEffect(() => {
    if (!id) return;

    const activitiesKey = `childActivities_${id}`;
    const storedActivities = localStorage.getItem(activitiesKey);

    if (storedActivities) {
      const activitiesData = JSON.parse(storedActivities);
      setActivities(activitiesData || []);
    } else {
      // Create sample data
      const mockActivities = generateMockActivities();
      localStorage.setItem(activitiesKey, JSON.stringify(mockActivities));
      setActivities(mockActivities);
    }
  }, [id]);

  useEffect(() => {
    const storedChildren = localStorage.getItem('childrenList');
    if (storedChildren && id) {
      const children = JSON.parse(storedChildren);
      const foundChild = children.find((c: Child) => c.id === id);
      if (foundChild) {
        setChild(foundChild);
      }
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load wallet balance, goals, and allowance
  useEffect(() => {
    if (!id) return;

    // Load wallet balance
    const walletKey = `childWallet_${id}`;
    const storedWallet = localStorage.getItem(walletKey);
    if (storedWallet) {
      const walletData = JSON.parse(storedWallet);
      setWalletBalance(walletData.balance || 0);
    } else {
      const randomBalance = Math.floor(Math.random() * 5000000) + 100000;
      const walletData = { balance: randomBalance };
      localStorage.setItem(walletKey, JSON.stringify(walletData));
      setWalletBalance(randomBalance);
    }

    // Load goals
    const goalsKey = `childGoals_${id}`;
    const storedGoals = localStorage.getItem(goalsKey);
    if (storedGoals) {
      const parsedGoals: Goal[] = JSON.parse(storedGoals);
      setGoals(parsedGoals);
    } else {
      const sampleGoal: Goal = {
        id: `goal_${id}_1`,
        title: 'دوچرخه جدید',
        currentAmount: 8000000,
        targetAmount: 12000000,
        childId: id
      };
      localStorage.setItem(goalsKey, JSON.stringify([sampleGoal]));
      setGoals([sampleGoal]);
    }

    // Load allowance
    const allowanceKey = `childAllowance_${id}`;
    const storedAllowance = localStorage.getItem(allowanceKey);
    if (storedAllowance) {
      const parsedAllowance: Allowance = JSON.parse(storedAllowance);
      setAllowance(parsedAllowance);
    } else {
      const nextFriday = new Date();
      nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
      const sampleAllowance: Allowance = {
        childId: id,
        amount: 1000000,
        frequency: 'weekly',
        isActive: true,
        nextPayout: nextFriday.getTime()
      };
      localStorage.setItem(allowanceKey, JSON.stringify(sampleAllowance));
      setAllowance(sampleAllowance);
    }

    // Load defined tasks
    const tasksKey = `tasks_${id}`;
    const storedTasks = localStorage.getItem(tasksKey);
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks);
      // Migrate old tasks to remove type field if needed
      const migratedTasks = allTasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        reward: task.reward,
      }));
      setDefinedTasks(migratedTasks);
    } else {
      setDefinedTasks([]);
    }

    // Calculate tasks stats
    const activitiesKey = `childActivities_${id}`;
    const storedActivities = localStorage.getItem(activitiesKey);
    if (storedActivities) {
      const allActivities: Activity[] = JSON.parse(storedActivities);
      setTasksStats({
        active: allActivities.filter(a => a.status === 'in-progress').length,
        completed: allActivities.filter(a => a.status === 'completed').length,
        pending: allActivities.filter(a => a.status === 'pending').length
      });
    }

    // Load wallet activities
    loadWalletActivities();
  }, [id]);

  const loadWalletActivities = () => {
    if (!id) return;
    
    const allActivities: any[] = [];
    
    // Load from childRecentActivities
    const recentActivitiesKey = `childRecentActivities_${id}`;
    const storedRecentActivities = localStorage.getItem(recentActivitiesKey);
    
    if (storedRecentActivities) {
      try {
        const activities = JSON.parse(storedRecentActivities);
        if (activities && Array.isArray(activities) && activities.length > 0) {
          activities.forEach((activity: any) => {
            allActivities.push({
              ...activity,
              childId: id
            });
          });
        }
      } catch (e) {
        console.error('Error parsing activities:', e);
      }
    }
    
    // Also load from childActivities (tasks/activities)
    const activitiesKey = `childActivities_${id}`;
    const storedActivities = localStorage.getItem(activitiesKey);
    if (storedActivities) {
      const activities: any[] = JSON.parse(storedActivities);
      activities.forEach((activity: any) => {
        if (activity.status === 'completed' && activity.points) {
          allActivities.push({
            id: `task_${activity.id}`,
            title: `پاداش: ${activity.title}`,
            amount: activity.points * 10000, // Convert digits to money
            type: 'income' as const,
            date: activity.date || Date.now(),
            icon: 'wallet',
            childId: id
          });
        }
      });
    }
    
    // Sort by date (newest first)
    allActivities.sort((a, b) => b.date - a.date);
    setWalletActivities(allActivities);
  };

  // Generate sample data for activities
  const generateMockActivities = (): Activity[] => {
    const now = Date.now();
    return [
      {
        id: '1',
        title: 'خرید اسباب بازی',
        description: 'خرید یک اسباب بازی از فروشگاه',
        category: 'خرید',
        date: now - 2 * 24 * 60 * 60 * 1000,
        duration: 30,
        status: 'completed',
        points: 40
      },
      {
        id: '2',
        title: 'پرداخت قبوض',
        description: 'پرداخت قبض آب و برق',
        category: 'پرداخت',
        date: now - 3 * 24 * 60 * 60 * 1000,
        duration: 15,
        status: 'in-progress',
        points: 30
      },
      {
        id: '3',
        title: 'واریز وجه',
        description: 'واریز وجه به کیف پول',
        category: 'واریز',
        date: now - 5 * 24 * 60 * 60 * 1000,
        duration: 5,
        status: 'completed',
        points: 25
      },
      {
        id: '4',
        title: 'خرید کتاب',
        description: 'خرید کتاب از کتابفروشی',
        category: 'خرید',
        date: now - 7 * 24 * 60 * 60 * 1000,
        duration: 25,
        status: 'completed',
        points: 35
      },
    ];
  };

  const getTimeStatus = (child: Child): string => {
    if (child.isOnline && child.onlineSince) {
      const totalMinutes = Math.floor((currentTime - child.onlineSince) / 60000);
      if (totalMinutes < 1) {
        return 'همین الان آنلاین شد';
      }
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours > 0 && minutes > 0) {
        return `${hours} ساعت و ${minutes} دقیقه آنلاین است`;
      } else if (hours > 0) {
        return `${hours} ساعت آنلاین است`;
      } else {
        return `${minutes} دقیقه آنلاین است`;
      }
    } else if (child.lastOnlineTime) {
      const totalMinutes = Math.floor((currentTime - child.lastOnlineTime) / 60000);
      if (totalMinutes < 1) {
        return 'همین الان آنلاین بود';
      }
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours > 0 && minutes > 0) {
        return `${hours} ساعت و ${minutes} دقیقه پیش آنلاین بود`;
      } else if (hours > 0) {
        return `${hours} ساعت پیش آنلاین بود`;
      } else {
        return `${minutes} دقیقه پیش آنلاین بود`;
      }
    }
    return 'اطلاعاتی موجود نیست';
  };

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('fa-IR').format(balance);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      if (hours === 0) {
        return `امروز، ${date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
      }
      return `دیروز، ${date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
  };

  const getNextPayoutDay = (timestamp: number): string => {
    const date = new Date(timestamp);
    const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    return days[date.getDay()];
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    // Parse Persian date (format: YYYY/MM/DD)
    const parts = birthDate.split('/').map(Number);
    if (parts.length !== 3) return 0;
    
    const [persianYear, persianMonth, persianDay] = parts;
    
    // Convert Persian date to Gregorian date
    // Persian year 1403 ≈ Gregorian year 2024
    // Simple conversion: Persian year - 621 = approximate Gregorian year
    const gregorianYear = persianYear - 621;
    
    // Create a date object (approximate conversion)
    // Note: This is a simplified conversion. For accurate conversion, use a library like moment-jalaali
    const birth = new Date(gregorianYear, persianMonth - 1, persianDay);
    const today = new Date();
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // Cap age at 18
    return Math.min(Math.max(age, 0), 18);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs bg-gray-800 text-white px-2.5 py-1 rounded-full font-semibold">انجام شده</span>;
      case 'in-progress':
        return <span className="text-xs bg-gray-600 text-white px-2.5 py-1 rounded-full font-semibold">در حال انجام</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-semibold">در انتظار</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'خرید':
        return <AiOutlineShopping className="w-5 h-5" />;
      case 'پرداخت':
        return <AiOutlineWallet className="w-5 h-5" />;
      case 'واریز':
        return <AiOutlineWallet className="w-5 h-5" />;
      default:
        return <AiOutlineFileText className="w-5 h-5" />;
    }
  };

  const toggleAllowance = () => {
    if (!id || !allowance) return;
    
    const updatedAllowance = {
      ...allowance,
      isActive: !allowance.isActive
    };
    
    setAllowance(updatedAllowance);
    
    // Update localStorage
    const allowanceKey = `childAllowance_${id}`;
    localStorage.setItem(allowanceKey, JSON.stringify(updatedAllowance));
  };


  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-gray-600">فرزند یافت نشد</p>
      </div>
    );
  }

  const sortedActivities = [...activities].sort((a, b) => b.date - a.date);
  const completedActivities = sortedActivities.filter(a => a.status === 'completed');
  const activeActivities = sortedActivities.filter(a => a.status === 'pending' || a.status === 'in-progress');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* Header with Avatar */}
      <div 
        className="h-64 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url(${child.avatar})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
        
        <button
          onClick={() => navigate('/children')}
          className="absolute top-4 left-4 p-2.5 bg-white/95 backdrop-blur-md hover:bg-white rounded-full transition-all shadow-lg z-10 hover:scale-105"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-800" />
        </button>

        <div className="absolute bottom-12 right-6 left-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <img
                src={child.avatar}
                alt={`${child.firstName} ${child.lastName}`}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              {child.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-white drop-shadow-lg">
                  {child.firstName} {child.lastName}
                </h1>
                {child.birthDate && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 shadow-lg"
                  >
                    <span className="text-white text-xs font-semibold">
                      {calculateAge(child.birthDate)} سال
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  child.isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'
                }`}></div>
                <p className={`text-sm font-medium text-white drop-shadow-md ${
                  child.isOnline ? 'text-white' : 'text-gray-200'
                }`}>
                  {getTimeStatus(child)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white rounded-t-3xl min-h-screen px-5 py-6 pb-24 -mt-12 relative z-10 "
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Wallet Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              loadWalletActivities();
              setShowWalletModal(true);
            }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-2">
              <WalletIcon className="w-6 h-6 text-white/90" />
            </div>
            <p className="text-white/80 text-xs mb-1">موجودی کیف پول</p>
            <p className="text-white text-lg font-bold">{formatBalance(walletBalance)} تومان</p>
          </motion.div>

          {/* Tasks Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            onClick={() => navigate(`/children/${id}/define-task`)}
            className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 shadow-lg cursor-pointer hover:from-gray-600 hover:to-gray-700 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="w-6 h-6 text-white/90" />
            </div>
            <p className="text-white/80 text-xs mb-1">تسک‌های تعریف شده</p>
            <p className="text-white text-lg font-bold">{definedTasks.length} تسک</p>
          </motion.div>

          {/* Completed Tasks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowCompletedTasksModal(true)}
            className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-4 shadow-lg cursor-pointer hover:from-gray-500 hover:to-gray-600 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-2">
              <TrophyIcon className="w-6 h-6 text-white/90" />
            </div>
            <p className="text-white/80 text-xs mb-1">تسک‌های انجام شده</p>
            <p className="text-white text-lg font-bold">{tasksStats.completed} تسک</p>
          </motion.div>

          {/* Total Digits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <CurrencyDollarIcon className="w-6 h-6 text-white/90" />
            </div>
            <p className="text-white/80 text-xs mb-1">مجموع دیجیت‌ها</p>
            <p className="text-white text-lg font-bold">
              {activities.reduce((sum, a) => sum + (a.points || 0), 0)} دیجیت
            </p>
          </motion.div>
        </div>

        {/* Define Task Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/children/${id}/define-task`)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-gray-800 to-gray-900 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>تعریف تسک</span>
          </motion.button>
        </motion.div>

        {/* Goals Section */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">اهداف</h3>
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BsFlag className="w-5 h-5 text-gray-800" />
                        <h4 className="font-bold text-gray-900">{goal.title}</h4>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 h-2.5 rounded-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatBalance(goal.currentAmount)} تومان</span>
                      <span>{formatBalance(goal.targetAmount)} تومان</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Weekly Allowance */}
        {allowance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BsPiggyBank className="w-5 h-5 text-gray-800" />
                  <h4 className="font-bold text-gray-900">حقوق هفتگی</h4>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`allowance-${id}`}
                      checked={allowance.isActive}
                      onChange={toggleAllowance}
                      className="w-4 h-4 text-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">فعال</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`allowance-${id}`}
                      checked={!allowance.isActive}
                      onChange={toggleAllowance}
                      className="w-4 h-4 text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">غیرفعال</span>
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                {formatBalance(allowance.amount)} تومان / هفته
              </p>
              <p className="text-xs text-gray-500">
                پرداخت بعدی: {getNextPayoutDay(allowance.nextPayout)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Active Tasks */}
        {activeActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">تسک‌های فعال</h3>
              <span className="text-sm text-gray-500">{activeActivities.length} تسک</span>
            </div>
            <div className="space-y-3">
              {activeActivities.slice(0, 3).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activity.status === 'in-progress' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getCategoryIcon(activity.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                          {activity.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {formatTime(activity.date)}
                        </span>
                        {activity.points !== undefined && activity.points > 0 && (
                          <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-semibold border border-yellow-200">
                            <CurrencyDollarIcon className="w-3 h-3" />
                            {activity.points} دیجیت
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Activities */}
        {completedActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">فعالیت‌های انجام شده</h3>
              <span className="text-sm text-gray-500">{completedActivities.length} فعالیت</span>
            </div>
            <div className="space-y-3">
              {completedActivities.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center shrink-0">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                          {activity.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {formatTime(activity.date)}
                        </span>
                        {activity.points !== undefined && activity.points > 0 && (
                          <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-semibold border border-yellow-200">
                            <CurrencyDollarIcon className="w-3 h-3" />
                            {activity.points} دیجیت
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineFileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">هنوز فعالیتی ثبت نشده است</h3>
            <p className="text-gray-600 text-sm">
              فعالیت‌های فرزند شما در اینجا نمایش داده می‌شود
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Wallet Details Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="جزئیات کیف پول"
        maxHeight="80vh"
      >
        <div className="space-y-6">
          {/* Balance Display */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center">
            <p className="text-white/80 text-sm mb-2">موجودی فعلی</p>
            <p className="text-white text-3xl font-bold">{formatBalance(walletBalance)} تومان</p>
          </div>

          {/* Transactions List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">تراکنش‌ها</h3>
            {walletActivities.length > 0 ? (
              <div className="space-y-3">
                {walletActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatTime(activity.date)}</p>
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
          </div>
        </div>
      </Modal>

      {/* Completed Tasks Modal */}
      <Modal
        isOpen={showCompletedTasksModal}
        onClose={() => setShowCompletedTasksModal(false)}
        title="تسک‌های انجام شده"
        maxHeight="80vh"
      >
        <div className="space-y-4">
          {completedActivities.length > 0 ? (
            <div className="space-y-3">
              {completedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-1">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {formatTime(activity.date)}
                        </span>
                        {activity.category && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                            {activity.category}
                          </span>
                        )}
                        {activity.points !== undefined && activity.points > 0 && (
                          <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-semibold border border-yellow-200">
                            <CurrencyDollarIcon className="w-3 h-3" />
                            {activity.points} دیجیت
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">هنوز تسک انجام شده‌ای وجود ندارد</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ChildDetailPage;

