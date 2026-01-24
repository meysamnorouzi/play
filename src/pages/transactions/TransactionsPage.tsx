import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { useAuth } from "../../context/AuthContext"; // Kept for future use
import {
  WalletIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  AiOutlineWallet,
  AiOutlineShopping,
  AiOutlineRest,
  AiOutlineArrowDown,
} from "react-icons/ai";

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
  type: "expense" | "income";
  date: number;
  icon: string;
  childId: string;
}

function TransactionsPage() {
  // const { user } = useAuth(); // Kept for future use
  const [_totalBalance, setTotalBalance] = useState<number>(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [_stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    transactionsCount: 0,
  });

  // Parent wallet state
  const [_parentMoneyBalance, setParentMoneyBalance] = useState<number>(0);
  const [_parentDigitBalance, setParentDigitBalance] = useState<number>(0);

  // Get account owner name - kept for future use
  // const accountOwnerName =
  //   user?.firstName && user?.lastName
  //     ? `${user.firstName} ${user.lastName}`
  //     : user?.firstName || "کاربر";

  useEffect(() => {
    loadWalletData();
    loadParentWallet();
  }, []);

  const loadParentWallet = () => {
    // Load parent wallet (money and digits)
    const parentWalletKey = "parentWallet";
    const storedParentWallet = localStorage.getItem(parentWalletKey);

    if (storedParentWallet) {
      const walletData = JSON.parse(storedParentWallet);
      setParentMoneyBalance(walletData.money || 0);
      setParentDigitBalance(walletData.digits || 0);
    } else {
      // Initialize with default values
      const defaultWallet = {
        money: 10000000, // 10 million Toman
        digits: 1000, // 1000 digits
      };
      localStorage.setItem(parentWalletKey, JSON.stringify(defaultWallet));
      setParentMoneyBalance(defaultWallet.money);
      setParentDigitBalance(defaultWallet.digits);
    }
  };

  const loadWalletData = () => {
    // Load children
    const storedChildren = localStorage.getItem("childrenList");
    const parsedChildren: Child[] = storedChildren
      ? JSON.parse(storedChildren)
      : [];
    setChildren(parsedChildren);

    // Calculate total balance
    let total = 0;
    const allActivities: Activity[] = [];

    if (parsedChildren.length > 0) {
      parsedChildren.forEach((child) => {
        // Get wallet balance
        const walletKey = `childWallet_${child.id}`;
        const storedWallet = localStorage.getItem(walletKey);
        if (storedWallet) {
          const walletData = JSON.parse(storedWallet);
          total += walletData.balance || 0;
        } else {
          // Create random balance if doesn't exist
          const randomBalance = Math.floor(Math.random() * 5000000) + 100000;
          const walletData = { balance: randomBalance };
          localStorage.setItem(walletKey, JSON.stringify(walletData));
          total += randomBalance;
        }

        // Load activities from childRecentActivities
        const recentActivitiesKey = `childRecentActivities_${child.id}`;
        const storedRecentActivities =
          localStorage.getItem(recentActivitiesKey);
        let hasActivities = false;

        if (storedRecentActivities) {
          try {
            const activities: Activity[] = JSON.parse(storedRecentActivities);
            if (
              activities &&
              Array.isArray(activities) &&
              activities.length > 0
            ) {
              hasActivities = true;
              activities.forEach((activity) => {
                allActivities.push({
                  ...activity,
                  childId: child.id,
                });
              });
            }
          } catch (e) {
            console.error("Error parsing activities:", e);
          }
        }

        // Always create sample activities if doesn't exist or is empty
        // This ensures there's always data to display
        if (!hasActivities) {
          const now = Date.now();
          const sampleActivities: Activity[] = [
            {
              id: `activity_${child.id}_1`,
              title: "فروشگاه پلی‌استیشن",
              amount: 1599000,
              type: "expense",
              date: now - 2 * 60 * 60 * 1000, // 2 hours ago
              icon: "game",
              childId: child.id,
            },
            {
              id: `activity_${child.id}_2`,
              title: "مک‌دونالد",
              amount: 850000,
              type: "expense",
              date: now - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000, // Yesterday
              icon: "food",
              childId: child.id,
            },
            {
              id: `activity_${child.id}_3`,
              title: "واریز حقوق هفتگی",
              amount: 1000000,
              type: "income",
              date: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
              icon: "wallet",
              childId: child.id,
            },
            {
              id: `activity_${child.id}_4`,
              title: "خرید کتاب",
              amount: 450000,
              type: "expense",
              date: now - 5 * 24 * 60 * 60 * 1000, // 5 days ago
              icon: "wallet",
              childId: child.id,
            },
            {
              id: `activity_${child.id}_5`,
              title: "پاداش انجام تسک",
              amount: 500000,
              type: "income",
              date: now - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              icon: "wallet",
              childId: child.id,
            },
          ];
          localStorage.setItem(
            recentActivitiesKey,
            JSON.stringify(sampleActivities)
          );
          sampleActivities.forEach((activity) => {
            allActivities.push(activity);
          });
        }

        // Also load from childActivities (tasks/activities)
        const activitiesKey = `childActivities_${child.id}`;
        const storedActivities = localStorage.getItem(activitiesKey);
        if (storedActivities) {
          const activities: any[] = JSON.parse(storedActivities);
          // Convert tasks to activities format if needed
          activities.forEach((activity: any) => {
            if (activity.status === "completed" && activity.points) {
              allActivities.push({
                id: `task_${activity.id}`,
                title: `پاداش: ${activity.title}`,
                amount: activity.points * 10000, // Convert digits to money
                type: "income" as const,
                date: activity.date || Date.now(),
                icon: "wallet",
                childId: child.id,
              });
            }
          });
        }
      });
    } else {
      // If no children, create a default balance and sample activities
      total = Math.floor(Math.random() * 10000000) + 5000000;
      const now = Date.now();
      const defaultActivities: Activity[] = [
        {
          id: "default_activity_1",
          title: "واریز اولیه",
          amount: 2000000,
          type: "income",
          date: now - 1 * 24 * 60 * 60 * 1000,
          icon: "wallet",
          childId: "default",
        },
        {
          id: "default_activity_2",
          title: "خرید آنلاین",
          amount: 750000,
          type: "expense",
          date: now - 3 * 24 * 60 * 60 * 1000,
          icon: "wallet",
          childId: "default",
        },
        {
          id: "default_activity_3",
          title: "پرداخت قبوض",
          amount: 1200000,
          type: "expense",
          date: now - 5 * 24 * 60 * 60 * 1000,
          icon: "wallet",
          childId: "default",
        },
      ];
      defaultActivities.forEach((activity) => {
        allActivities.push(activity);
      });
    }

    setTotalBalance(total);

    // Sort activities by date and get recent 10
    const sortedActivities = allActivities
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
    setRecentActivities(sortedActivities);

    // Calculate stats from all activities (not just recent 10)
    const allSortedActivities = allActivities.sort((a, b) => b.date - a.date);
    const income = allSortedActivities
      .filter((a) => a.type === "income")
      .reduce((sum, a) => sum + a.amount, 0);

    const expense = allSortedActivities
      .filter((a) => a.type === "expense")
      .reduce((sum, a) => sum + a.amount, 0);

    setStats({
      totalIncome: income,
      totalExpense: expense,
      transactionsCount: allSortedActivities.length,
    });
  };

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat("fa-IR").format(balance);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? "همین الان" : `${minutes} دقیقه پیش`;
      }
      return `${hours} ساعت پیش`;
    }
    const days = Math.floor(hours / 24);
    if (days === 1) return "دیروز";
    if (days < 7) return `${days} روز پیش`;
    return date.toLocaleDateString("fa-IR", { month: "long", day: "numeric" });
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case "game":
        return <AiOutlineShopping className="w-5 h-5" />;
      case "food":
        return <AiOutlineRest className="w-5 h-5" />;
      default:
        return <AiOutlineWallet className="w-5 h-5" />;
    }
  };

  const getChildName = (childId: string): string => {
    if (childId === "default") return "حساب اصلی";
    const child = children.find((c) => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "نامشخص";
  };

  return (
    <div className="bg-white min-h-screen px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">لیست تراکنش ها</h1>
        </div>
        <p className="text-gray-600 text-sm">
          لیست تراکنش‌های شما اینجا نمایش داده می‌شود
        </p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        <div className=" h-20 border border-indigo-700 mb-3 flex items-center justify-center flex-col rounded-lg ">
          <HeartIcon className="w-6 h-6 text-indigo-700" />
          <p className="text-xs font-semibold mt-1 text-indigo-700">همه</p>
        </div>
        <div className=" h-20 border border-gray-200 mb-3 flex items-center justify-center flex-col rounded-lg ">
          <CheckCircleIcon className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900"> موفق</p>
        </div>
        <div className=" h-20 border border-gray-200 mb-3 flex items-center justify-center flex-col rounded-lg ">
          <WalletIcon className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900"> ناموفق</p>
        </div>
        <div className=" h-20 border border-gray-200 mb-3 flex items-center justify-center flex-col rounded-lg ">
          <ShoppingBagIcon className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900">فروشگاه</p>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-3"
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
          <input
            type="text"
            placeholder="جستجوی تراکنش ها ..."
            className="w-full pr-10 pl-4 py-3 placeholder-black text-black bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
          />
        </div>
      </motion.div>

      <div className="space-y-2 mb-3">
        <select
          id="transferChild"
          className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
        >
          <option value="">فیلتر براساس فرزند ...</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.firstName} {child.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                activity.type === "income"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {activity.type === "income" ? (
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
                <p className="text-xs text-gray-500">
                  {getChildName(activity.childId)}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">
                  {formatTime(activity.date)}
                </p>
              </div>
            </div>

            <div className="text-left shrink-0">
              <p
                className={`text-sm font-bold ${
                  activity.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {activity.type === "income" ? "+" : "-"}{" "}
                {formatBalance(activity.amount)}
              </p>
              <p className="text-xs text-gray-500">تومان</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsPage;
