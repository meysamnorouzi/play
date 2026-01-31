import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  CheckIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import AddChildModal from "../../components/children/AddChildModal";
import { Input } from "../../components/ui";
import { toPersianNumber } from "../../utils/numberUtils";
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
  useAuth();
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
  const [isDigitMode, setIsDigitMode] = useState(false); // false = money, true = digit
  const [digitAmount, setDigitAmount] = useState(""); // Amount in digits
  const [chargeAmount, setChargeAmount] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // Calculate money from digits: هر 100 دیجیت = 25000 تومان
  const calculateMoneyFromDigits = (digits: number): number => {
    return Math.floor((digits / 100) * 25000);
  };

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
              title: "پاداش انجام ماموریت",
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
        return minutes < 1 ? "همین الان" : `${toPersianNumber(minutes)} دقیقه پیش`;
      }
      return `${toPersianNumber(hours)} ساعت پیش`;
    }
    const days = Math.floor(hours / 24);
    if (days === 1) return "دیروز";
    if (days < 7) return `${toPersianNumber(days)} روز پیش`;
    return date.toLocaleDateString("fa-IR", { month: "long", day: "numeric" });
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case "game":
        return <AiOutlineShopping className="w-6 h-6 sm:w-7 sm:h-7" />;
      case "food":
        return <AiOutlineRest className="w-6 h-6 sm:w-7 sm:h-7" />;
      default:
        return <AiOutlineWallet className="w-6 h-6 sm:w-7 sm:h-7" />;
    }
  };

  const getChildName = (childId: string): string => {
    if (childId === "default") return "حساب اصلی";
    const child = children.find((c) => c.id === childId);
    return child ? `${child.firstName} ${child.lastName}` : "نامشخص";
  };

  const handleAddChildSubmit = (childData: {
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    avatar: string;
  }) => {
    const now = Date.now();
    const isOnline = Math.random() > 0.5;
    const newChild = {
      id: Date.now().toString(),
      ...childData,
      password: "",
      isOnline,
      onlineSince: isOnline ? now : undefined,
      lastOnlineTime: isOnline ? undefined : now - Math.random() * 24 * 60 * 60 * 1000,
    };
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    localStorage.setItem("childrenList", JSON.stringify(updatedChildren));
    setShowAddChildModal(false);
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
      <div className="bg-white min-h-screen px-3 sm:px-4 py-4 sm:py-6">
        {/* Main Balance Card */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full mb-6"
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
              {/* Front of Card - Digipay style با رنگ سبز */}
              <div
                className="relative rounded-2xl p-4 sm:p-6 overflow-hidden aspect-video cursor-pointer select-none"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  pointerEvents: "auto",
                  backgroundColor: "#0a3324",
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
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
                {/* Main Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Top Section - Chip + Card Number */}
                  <div className="flex items-center justify-between">
                    {/* Card Number - Persian numerals masked */}
                    <p className="text-white/90 text-base font-medium tracking-widest">
                      {toPersianNumber("5047 56** **** 1971")}
                    </p>
                    <p className="text-white/90 text-2xl font-semibold lowercase tracking-wide">
                      digicard
                    </p>
                  </div>

                  {/* Balance Display - Center */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                      <p className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 break-all">
                        {formatBalance(totalBalance)}
                      </p>
                      <p className="text-white/80 text-sm sm:text-base font-medium">ریال</p>
                    </div>
                  </div>

                  {/* Bottom Section - digipay + Expiry */}
                  <div className="flex items-end justify-between mt-auto">
                  <p className="text-white/80 text-sm font-medium">
                      {toPersianNumber("09/09")}
                    </p>
                    {/* EMV Chip - خطوط افقی */}
                   <img src="/image/Shetab_Banking_System.png" alt="" className="w-8" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTransferModal(true)}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-[#359C67] text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all"
            >
              <span>انتقال</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDepositModal(true)}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-[#359C67] text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all"
            >
              <span>افزایش موجودی</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="bg-red-50 rounded-lg p-2 sm:p-3">
                <ArrowTrendingDownIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">هزینه</span>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {formatBalance(stats.totalExpense)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">تومان</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">تراکنش</span>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {toPersianNumber(stats.transactionsCount)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">مورد</p>
          </motion.div>
        </div>

        {/* Children Wallets Summary */}
        {children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-5 sm:mb-6 bg-white rounded-xl p-5 sm:p-6 border border-gray-200"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5">
              کیف پول فرزندان
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {children.map((child) => {
                const walletKey = `childWallet_${child.id}`;
                const storedWallet = localStorage.getItem(walletKey);
                const balance = storedWallet
                  ? JSON.parse(storedWallet).balance || 0
                  : 0;

                return (
                  <div
                    key={child.id}
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={child.avatar}
                      alt={`${child.firstName} ${child.lastName}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        موجودی کیف پول
                      </p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm sm:text-base font-bold text-gray-900">
                        {formatBalance(balance)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">تومان</p>
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
          className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">تراکنش‌های اخیر</h2>
            <button className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium">
              مشاهده همه
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 sm:gap-4 py-3.5 sm:py-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${activity.type === "income"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                      }`}
                  >
                    {activity.type === "income" ? (
                      <AiOutlineArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                    ) : (
                      getActivityIcon(activity.icon)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {getChildName(activity.childId)}
                      </p>
                      <span className="text-xs sm:text-sm text-gray-400">•</span>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatTime(activity.date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <p
                      className={`text-sm sm:text-base font-bold ${activity.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      {activity.type === "income" ? "+" : "-"}{" "}
                      {formatBalance(activity.amount)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">تومان</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-14">
              <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-5">
                <WalletIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm sm:text-base">هنوز تراکنشی ثبت نشده است</p>
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
        title="افزایش موجودی"
        maxHeight="90vh"
      >
        <div className="space-y-6">
          <Input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="مثال: 1000000"
            dir="ltr"
            min={1}
          />

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
            className="w-full bg-[#359C67] text-white py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <span>افزایش موجودی</span>
          </motion.button>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferAmount("");
          setDigitAmount("");
          setSelectedChildId("");
          setIsDigitMode(false);
          setInsufficientBalance(false);
        }}
        title="انتقال"
        maxHeight="90vh"
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
                onClick={() => setShowAddChildModal(true)}
                className="flex w-full justify-center items-center gap-2 mt-5 bg-[#359C67] text-white px-14 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span>افزودن فرزند</span>
              </motion.button>
            </div>
          ) : insufficientBalance ? (
            // Step: Insufficient balance - show charge flow
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5 mb-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-red-700 text-base font-bold mb-2">
                      موجودی کافی نیست!
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-red-600 text-sm">
                        <span className="font-semibold">موجودی فعلی:</span>{" "}
                        {isDigitMode
                          ? `${formatBalance(parentDigitBalance)} دیجیت`
                          : `${formatBalance(parentMoneyBalance)} تومان`}
                      </p>
                      <p className="text-red-600 text-sm">
                        <span className="font-semibold">مبلغ درخواستی:</span>{" "}
                        {isDigitMode
                          ? `${formatBalance(parseFloat(digitAmount) || parseFloat(transferAmount) || 0)} دیجیت`
                          : `${formatBalance(parseFloat(transferAmount) || 0)} تومان`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-3">
                <Input
                  type="number"
                  id="chargeAmount"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  placeholder={isDigitMode ? "مثال: 500" : "مثال: 1000000"}
                  dir="ltr"
                  min={1}
                />
                <p className="text-sm text-gray-500">
                  حداقل مبلغ:{" "}
                  {isDigitMode
                    ? formatBalance(
                      (parseFloat(digitAmount) || parseFloat(transferAmount) || 0) - parentDigitBalance
                    ) + " دیجیت"
                    : formatBalance(
                      parseFloat(transferAmount) - parentMoneyBalance
                    ) + " تومان"}
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInsufficientBalance(false);
                    setChargeAmount("");
                  }}
                  className="flex-1 px-5 py-4 rounded-xl border-2 border-gray-300 text-gray-700 text-base font-semibold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-6 h-6 inline ml-2" />
                  بازگشت
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const charge = parseFloat(chargeAmount);
                    const required = isDigitMode
                      ? (parseFloat(digitAmount) || parseFloat(transferAmount) || 0) - parentDigitBalance
                      : parseFloat(transferAmount) - parentMoneyBalance;

                    if (charge >= required && charge > 0) {
                      // Charge the wallet
                      const parentWalletKey = "parentWallet";
                      const storedParentWallet =
                        localStorage.getItem(parentWalletKey);
                      const walletData = storedParentWallet
                        ? JSON.parse(storedParentWallet)
                        : { money: 0, digits: 0 };

                      if (isDigitMode) {
                        walletData.digits = (walletData.digits || 0) + charge;
                      } else {
                        walletData.money = (walletData.money || 0) + charge;
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
                  className="flex-1 bg-gray-800 text-white py-4 rounded-xl text-base font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-6 h-6" />
                  شارژ کیف پول
                </motion.button>
              </div>
            </>
          ) : (
            // Select child and enter amount
            <>
              <div className="space-y-3">
                <label
                  htmlFor="transferChild"
                  className="block text-base font-bold text-gray-900 mb-2"
                >
                  انتخاب فرزند
                </label>
                <div className="relative">
                  <select
                    id="transferChild"
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full px-5 py-4 pr-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#359C67] focus:ring-2 focus:ring-[#359C67]/20 outline-none transition-all bg-white shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">انتخاب کنید...</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.firstName} {child.lastName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Toggle: انتقال دیجیت */}
              <div className="flex items-center gap-2 py-2">
                <span className={`text-sm font-medium ${isDigitMode ? 'text-gray-900' : 'text-gray-500'}`}>
                  انتقال دیجیت
                </span>
                <button
                  onClick={() => {
                    setIsDigitMode(!isDigitMode);
                    setTransferAmount("");
                    setDigitAmount("");
                  }}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#359C67] focus:ring-offset-2 ${isDigitMode ? 'bg-[#359C67]' : 'bg-gray-300'
                    }`}
                  type="button"
                  role="switch"
                  aria-checked={isDigitMode}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${isDigitMode ? 'translate-x-[-22px]' : 'translate-x-[-2px]'
                      }`}
                  />
                </button>
              </div>

              {/* Money Input */}
              {!isDigitMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    type="number"
                    id="transferAmount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0"
                    dir="ltr"
                    min={1}
                    inputClassName="text-lg border-2 focus:border-[#359C67] focus:ring-[#359C67]/20"
                  />
                  <div className="bg-gradient-to-r from-[#359C67]/10 to-[#359C67]/5 rounded-xl p-4 border border-[#359C67]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">موجودی شما:</span>
                      <span className="text-lg font-bold text-[#359C67]">
                        {formatBalance(parentMoneyBalance)} تومان
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Digit Input */}
              {isDigitMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    type="number"
                    id="digitAmount"
                    value={digitAmount}
                    onChange={(e) => {
                      const digits = e.target.value;
                      setDigitAmount(digits);
                      if (digits) {
                        const calculatedMoney = calculateMoneyFromDigits(parseFloat(digits));
                        setTransferAmount(calculatedMoney.toString());
                      } else {
                        setTransferAmount("");
                      }
                    }}
                    placeholder="0"
                    dir="ltr"
                    min={1}
                    inputClassName="text-lg border-2 focus:border-[#359C67] focus:ring-[#359C67]/20"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-900">مبلغ معادل:</span>
                      <span className="text-xl font-bold text-blue-700">
                        {formatBalance(calculateMoneyFromDigits(parseFloat(digitAmount) || 0))} تومان
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100/50 rounded-lg px-3 py-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>هر 100 دیجیت = 25,000 تومان</span>
                    </div>
                  </motion.div>

                  <div className="bg-gradient-to-r from-[#359C67]/10 to-[#359C67]/5 rounded-xl p-4 border border-[#359C67]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">موجودی شما:</span>
                      <span className="text-lg font-bold text-[#359C67]">
                        {formatBalance(parentMoneyBalance)} تومان
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const amount = isDigitMode
                      ? parseFloat(digitAmount)
                      : parseFloat(transferAmount);
                    const hasEnough = isDigitMode
                      ? parentDigitBalance >= amount
                      : parentMoneyBalance >= amount;

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
                    if (isDigitMode) {
                      walletData.digits = (walletData.digits || 0) - amount;
                    } else {
                      walletData.money = (walletData.money || 0) - amount;
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

                    if (isDigitMode) {
                      childWalletData.digits =
                        (childWalletData.digits || 0) + amount;
                    } else {
                      childWalletData.balance =
                        (childWalletData.balance || 0) + amount;
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
                      title: isDigitMode
                        ? `انتقال دیجیت از والد`
                        : `انتقال وجه از والد`,
                      amount: isDigitMode
                        ? calculateMoneyFromDigits(amount) // Convert digits to money for display
                        : amount,
                      type: "income",
                      date: Date.now(),
                      icon: "wallet",
                      ...(isDigitMode && { points: amount }),
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
                    setDigitAmount("");
                    setSelectedChildId("");
                    setIsDigitMode(false);
                    setInsufficientBalance(false);
                  }}
                  disabled={
                    !selectedChildId ||
                    (isDigitMode
                      ? (!digitAmount || parseFloat(digitAmount) <= 0)
                      : (!transferAmount || parseFloat(transferAmount) <= 0))
                  }
                  className="flex-1 bg-gradient-to-r from-[#359C67] to-[#2d7d52] text-white py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  <span>
                    انتقال {isDigitMode ? "دیجیت" : "وجه"}
                  </span>
                </motion.button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onAdd={handleAddChildSubmit}
      />
    </div>
  );
}

export default WalletPage;
