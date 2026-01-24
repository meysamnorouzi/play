import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  WalletIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
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

function WalletPage() {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [children, setChildren] = useState<Child[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    transactionsCount: 0,
  });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Parent wallet state
  const [parentMoneyBalance, setParentMoneyBalance] = useState<number>(0);
  const [parentDigitBalance, setParentDigitBalance] = useState<number>(0);

  // Transfer flow state
  const [transferType, setTransferType] = useState<"money" | "digit" | null>(
    null
  );
  const [chargeAmount, setChargeAmount] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  // Get account owner name
  const accountOwnerName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "کاربر";

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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(null);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      e.preventDefault();
      const touch = e.touches[0];
      setTouchEnd(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const minSwipeDistance = 50;

      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          // Swipe left (RTL) - flip to back
          setIsCardFlipped(true);
        } else {
          // Swipe right (RTL) - flip to front
          setIsCardFlipped(false);
        }
      }
    }

    // Reset after a short delay to prevent click event
    setTimeout(() => {
      setTouchStart(null);
      setTouchEnd(null);
      setIsDragging(false);
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setTouchEnd(null);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null && isDragging) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const minSwipeDistance = 50;

      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          // Swipe left (RTL) - flip to back
          setIsCardFlipped(true);
        } else {
          // Swipe right (RTL) - flip to front
          setIsCardFlipped(false);
        }
      }
    }

    // Reset after a short delay to prevent click event
    setTimeout(() => {
      setTouchStart(null);
      setTouchEnd(null);
      setIsDragging(false);
    }, 100);
  };

  const handleCardClick = () => {
    // Only flip on click if it wasn't a drag
    // Check if mouse moved less than 10px (click, not drag)
    if (touchStart !== null && touchEnd !== null) {
      const moveDistance = Math.abs(touchStart - touchEnd);
      if (moveDistance < 10) {
        setIsCardFlipped(!isCardFlipped);
      }
    } else {
      // If no drag was detected, it's a click
      setIsCardFlipped(!isCardFlipped);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white min-h-screen px-4 py-6">
        {/* Main Balance Card */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full"
            style={{
              perspective: "1000px",
              touchAction: "pan-x",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            <div
              className="relative w-full cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: "auto",
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleTouchStart(e);
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                handleTouchMove(e);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                handleTouchEnd();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e);
              }}
              onMouseMove={(e) => {
                e.stopPropagation();
                handleMouseMove(e);
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                handleMouseUp();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                handleMouseUp();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {/* Front of Card */}
              <div
                className="relative bg-indigo-700 rounded-2xl p-6 overflow-hidden aspect-video cursor-pointer select-none"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  pointerEvents: "auto",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Check if it was a click (not drag)
                  if (touchStart !== null && touchEnd !== null) {
                    const moveDistance = Math.abs(touchStart - touchEnd);
                    if (moveDistance < 10) {
                      setIsCardFlipped(!isCardFlipped);
                    }
                  } else {
                    setIsCardFlipped(!isCardFlipped);
                  }
                }}
              >
                {/* Card Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top Section - Card Type */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-xs font-medium mb-1">
                        کارت بانکی
                      </p>
                      <p className="text-white text-sm font-semibold">
                        Digi Play Card
                      </p>
                    </div>
                    <div className="text-white/90">
                      <WalletIcon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Balance Display - Center */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center flex items-center gap-2">
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
                      <p className="text-white/70 text-xs font-medium mb-1">
                        صاحب حساب
                      </p>
                      <p className="text-white text-sm font-semibold">
                        {accountOwnerName}
                      </p>
                    </div>

                    {/* Right Side - Card Number */}
                    <div className="text-left">
                      <p className="text-white text-sm font-semibold tracking-wider">
                        •••• •••• •••• 1214
                      </p>
                      <p className="text-white/70 text-xs mt-1">12/24</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div
                className="absolute inset-0 bg-indigo-700 rounded-2xl p-6 overflow-hidden aspect-video select-none cursor-pointer"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  pointerEvents: "auto",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Check if it was a click (not drag)
                  if (touchStart !== null && touchEnd !== null) {
                    const moveDistance = Math.abs(touchStart - touchEnd);
                    if (moveDistance < 10) {
                      setIsCardFlipped(!isCardFlipped);
                    }
                  } else {
                    setIsCardFlipped(!isCardFlipped);
                  }
                }}
              >
                {/* Card Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mb-12"></div>
                </div>

                {/* Back Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Middle Section - CVV */}
                  <div className="flex-1 flex flex-col mb-2 justify-center">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-xs">CVV</p>
                        <p className="text-white text-lg font-bold tracking-widest">
                          123
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Additional Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-xs">شماره کارت</p>
                      <p className="text-white text-sm font-semibold tracking-wider">
                        1214 5678 9012 3456
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-xs">تاریخ انقضا</p>
                      <p className="text-white text-sm font-semibold">12/24</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-xs">صاحب کارت</p>
                      <p className="text-white text-sm font-semibold">
                        {accountOwnerName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4 mb-4">
            <button
              onClick={() => setIsCardFlipped(false)}
              className={`w-2 h-2 rounded-full transition-all ${
                !isCardFlipped ? "bg-indigo-700 w-6" : "bg-gray-300"
              }`}
            />
            <button
              onClick={() => setIsCardFlipped(true)}
              className={`w-2 h-2 rounded-full transition-all ${
                isCardFlipped ? "bg-indigo-700 w-6" : "bg-gray-300"
              }`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTransferModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
              <span>انتقال</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDepositModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              کیف پول فرزندان
            </h2>
            <div className="space-y-3">
              {children.map((child) => {
                const walletKey = `childWallet_${child.id}`;
                const storedWallet = localStorage.getItem(walletKey);
                const balance = storedWallet
                  ? JSON.parse(storedWallet).balance || 0
                  : 0;

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
                      <p className="text-xs text-gray-500 mt-1">
                        موجودی کیف پول
                      </p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {formatBalance(balance)}
                      </p>
                      <p className="text-xs text-gray-500">تومان</p>
                    </div>
                  </div>
                );
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
                        activity.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
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

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setDepositAmount("");
        }}
        title="واریز وجه"
        maxHeight="70vh"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="depositAmount"
              className="block text-sm font-semibold text-gray-700"
            >
              مبلغ واریز (تومان)
            </label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
              placeholder="مثال: 1000000"
              dir="ltr"
              min="1"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const amount = parseFloat(depositAmount);
              if (amount > 0) {
                // Update parent wallet
                const parentWalletKey = "parentWallet";
                const storedParentWallet =
                  localStorage.getItem(parentWalletKey);
                const walletData = storedParentWallet
                  ? JSON.parse(storedParentWallet)
                  : { money: 0, digits: 0 };
                walletData.money = (walletData.money || 0) + amount;
                localStorage.setItem(
                  parentWalletKey,
                  JSON.stringify(walletData)
                );

                // Reload parent wallet
                loadParentWallet();

                // Close modal
                setShowDepositModal(false);
                setDepositAmount("");
              }
            }}
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
            className="w-full bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-6 h-6" />
            <span>واریز وجه</span>
          </motion.button>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferAmount("");
          setSelectedChildId("");
          setTransferType(null);
          setInsufficientBalance(false);
        }}
        title={
          transferType === null
            ? "انتقال"
            : transferType === "money"
            ? "انتقال وجه"
            : "انتقال دیجیت"
        }
        maxHeight="70vh"
      >
        <div className="space-y-6">
          {children.length === 0 ? (
            <div className="text-center w-full flex flex-col items-center justify-center py-8">
              <p className="text-gray-500 text-sm">
                برای انتقال ابتدا باید فرزندی اضافه کنید
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 mt-5 bg-indigo-700 text-white px-14 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span>افزودن فرزند</span>
              </motion.button>
            </div>
          ) : transferType === null ? (
            // Step 1: Choose transfer type
            <>
              <p className="text-sm text-gray-600 text-center mb-4">
                نوع انتقال را انتخاب کنید
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTransferType("money")}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-all bg-white"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 mb-1">انتقال وجه</p>
                    <p className="text-xs text-gray-500">
                      موجودی: {formatBalance(parentMoneyBalance)} تومان
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTransferType("digit")}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <CurrencyDollarIcon className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-black mb-1">انتقال دیجیت</p>
                    <p className="text-xs text-black">
                      موجودی: {formatBalance(parentDigitBalance)} دیجیت
                    </p>
                  </div>
                </motion.button>
              </div>
            </>
          ) : insufficientBalance ? (
            // Step: Insufficient balance - show charge flow
            <>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-700 text-sm font-semibold mb-2">
                  موجودی کافی نیست!
                </p>
                <p className="text-red-600 text-xs">
                  موجودی فعلی شما:{" "}
                  {transferType === "money"
                    ? `${formatBalance(parentMoneyBalance)} تومان`
                    : `${formatBalance(parentDigitBalance)} دیجیت`}
                </p>
                <p className="text-red-600 text-xs mt-1">
                  مبلغ درخواستی:{" "}
                  {transferType === "money"
                    ? `${formatBalance(parseFloat(transferAmount) || 0)} تومان`
                    : `${formatBalance(parseFloat(transferAmount) || 0)} دیجیت`}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="chargeAmount"
                  className="block text-sm font-semibold text-gray-700"
                >
                  مبلغ شارژ ({transferType === "money" ? "تومان" : "دیجیت"})
                </label>
                <input
                  type="number"
                  id="chargeAmount"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                  placeholder={
                    transferType === "money" ? "مثال: 1000000" : "مثال: 500"
                  }
                  dir="ltr"
                  min="1"
                />
                <p className="text-xs text-gray-500">
                  حداقل مبلغ:{" "}
                  {transferType === "money"
                    ? formatBalance(
                        parseFloat(transferAmount) - parentMoneyBalance
                      ) + " تومان"
                    : formatBalance(
                        parseFloat(transferAmount) - parentDigitBalance
                      ) + " دیجیت"}
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInsufficientBalance(false);
                    setChargeAmount("");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5 inline ml-2" />
                  بازگشت
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const charge = parseFloat(chargeAmount);
                    const required =
                      transferType === "money"
                        ? parseFloat(transferAmount) - parentMoneyBalance
                        : parseFloat(transferAmount) - parentDigitBalance;

                    if (charge >= required && charge > 0) {
                      // Charge the wallet
                      const parentWalletKey = "parentWallet";
                      const storedParentWallet =
                        localStorage.getItem(parentWalletKey);
                      const walletData = storedParentWallet
                        ? JSON.parse(storedParentWallet)
                        : { money: 0, digits: 0 };

                      if (transferType === "money") {
                        walletData.money = (walletData.money || 0) + charge;
                      } else {
                        walletData.digits = (walletData.digits || 0) + charge;
                      }

                      localStorage.setItem(
                        parentWalletKey,
                        JSON.stringify(walletData)
                      );
                      loadParentWallet();
                      setInsufficientBalance(false);
                      setChargeAmount("");
                    }
                  }}
                  disabled={!chargeAmount || parseFloat(chargeAmount) <= 0}
                  className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  شارژ کیف پول
                </motion.button>
              </div>
            </>
          ) : (
            // Step 2: Select child and enter amount
            <>
              <div className="space-y-2">
                <label
                  htmlFor="transferChild"
                  className="block text-sm font-semibold text-gray-700"
                >
                  انتخاب فرزند
                </label>
                <select
                  id="transferChild"
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                >
                  <option value="">انتخاب کنید...</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="transferAmount"
                  className="block text-sm font-semibold text-gray-700"
                >
                  {transferType === "money"
                    ? "مبلغ انتقال (تومان)"
                    : "مقدار دیجیت"}
                </label>
                <input
                  type="number"
                  id="transferAmount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                  placeholder={
                    transferType === "money" ? "مثال: 500000" : "مثال: 100"
                  }
                  dir="ltr"
                  min="1"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">موجودی شما:</span>
                  <span
                    className={`font-semibold ${
                      transferType === "money"
                        ? "text-indigo-700"
                        : "text-indigo-700"
                    }`}
                  >
                    {transferType === "money"
                      ? `${formatBalance(parentMoneyBalance)} تومان`
                      : `${formatBalance(parentDigitBalance)} دیجیت`}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTransferType(null);
                    setTransferAmount("");
                    setSelectedChildId("");
                    setInsufficientBalance(false);
                  }}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5 inline ml-2" />
                  بازگشت
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const amount = parseFloat(transferAmount);
                    const hasEnough =
                      transferType === "money"
                        ? parentMoneyBalance >= amount
                        : parentDigitBalance >= amount;

                    if (!hasEnough) {
                      setInsufficientBalance(true);
                      return;
                    }

                    // Perform transfer
                    const parentWalletKey = "parentWallet";
                    const storedParentWallet =
                      localStorage.getItem(parentWalletKey);
                    const walletData = storedParentWallet
                      ? JSON.parse(storedParentWallet)
                      : { money: 0, digits: 0 };

                    // Deduct from parent
                    if (transferType === "money") {
                      walletData.money = (walletData.money || 0) - amount;
                    } else {
                      walletData.digits = (walletData.digits || 0) - amount;
                    }
                    localStorage.setItem(
                      parentWalletKey,
                      JSON.stringify(walletData)
                    );

                    // Add to child wallet
                    const childWalletKey = `childWallet_${selectedChildId}`;
                    const storedChildWallet =
                      localStorage.getItem(childWalletKey);
                    const childWalletData = storedChildWallet
                      ? JSON.parse(storedChildWallet)
                      : { balance: 0, digits: 0 };

                    if (transferType === "money") {
                      childWalletData.balance =
                        (childWalletData.balance || 0) + amount;
                    } else {
                      childWalletData.digits =
                        (childWalletData.digits || 0) + amount;
                    }
                    localStorage.setItem(
                      childWalletKey,
                      JSON.stringify(childWalletData)
                    );

                    // Add activity
                    const activityKey = `childRecentActivities_${selectedChildId}`;
                    const storedActivities = localStorage.getItem(activityKey);
                    const activities = storedActivities
                      ? JSON.parse(storedActivities)
                      : [];
                    activities.unshift({
                      id: `transfer_${Date.now()}`,
                      title:
                        transferType === "money"
                          ? `انتقال وجه از والد`
                          : `انتقال دیجیت از والد`,
                      amount:
                        transferType === "money" ? amount : amount * 10000, // Convert digits to money for display
                      type: "income",
                      date: Date.now(),
                      icon: "wallet",
                      ...(transferType === "digit" && { points: amount }),
                    });
                    localStorage.setItem(
                      activityKey,
                      JSON.stringify(activities)
                    );

                    // Reload data
                    loadParentWallet();
                    loadWalletData();

                    // Close modal
                    setShowTransferModal(false);
                    setTransferAmount("");
                    setSelectedChildId("");
                    setTransferType(null);
                    setInsufficientBalance(false);
                  }}
                  disabled={
                    !transferAmount ||
                    !selectedChildId ||
                    parseFloat(transferAmount) <= 0
                  }
                  className="flex-1 bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>
                    انتقال {transferType === "money" ? "وجه" : "دیجیت"}
                  </span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default WalletPage;
