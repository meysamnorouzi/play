import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  TrashIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal";

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
  reward: number;
}

function DefineTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDigitGuide, setShowDigitGuide] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", reward: "" });

  useEffect(() => {
    if (!id) {
      navigate("/children");
      return;
    }

    // Load child data
    const storedChildren = localStorage.getItem("childrenList");
    if (storedChildren) {
      const children = JSON.parse(storedChildren);
      const foundChild = children.find((c: Child) => c.id === id);
      if (foundChild) {
        setChild(foundChild);
      } else {
        navigate("/children");
      }
    } else {
      navigate("/children");
    }

    // Load tasks for this child
    const storedTasks = localStorage.getItem(`tasks_${id}`);
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks);
      // Migrate old tasks to remove type field
      const migratedTasks = allTasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        reward: task.reward,
      }));
      setTasks(migratedTasks);
      if (id) {
        localStorage.setItem(`tasks_${id}`, JSON.stringify(migratedTasks));
      }
    }
  }, [id, navigate]);

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;

    // Parse Persian date (format: YYYY/MM/DD)
    const parts = birthDate.split("/").map(Number);
    if (parts.length !== 3) return 0;

    const [persianYear, persianMonth, persianDay] = parts;

    // Convert Persian date to Gregorian date
    // Persian year 1403 ≈ Gregorian year 2024
    // Simple conversion: Persian year - 621 = approximate Gregorian year
    // More accurate: use conversion algorithm
    const gregorianYear = persianYear - 621;

    // Create a date object (approximate conversion)
    // Note: This is a simplified conversion. For accurate conversion, use a library like moment-jalaali
    const birth = new Date(gregorianYear, persianMonth - 1, persianDay);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    // Cap age at 18
    return Math.min(Math.max(age, 0), 18);
  };

  const handleAddTask = () => {
    setShowAddModal(true);
  };

  const handleSaveTask = () => {
    if (!newTask.title.trim() || !newTask.reward.trim()) return;

    const reward = parseInt(newTask.reward);
    if (isNaN(reward) || reward <= 0) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      reward: reward,
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);

    if (id) {
      localStorage.setItem(`tasks_${id}`, JSON.stringify(updatedTasks));
    }

    setNewTask({ title: "", reward: "" });
    setShowAddModal(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);

    if (id) {
      localStorage.setItem(`tasks_${id}`, JSON.stringify(updatedTasks));
    }
  };

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      {/* Header with Avatar */}
      <div
        className="h-64 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url(${child.avatar})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>

        <button
          onClick={() => navigate(`/children/${id}`)}
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
              <p className="text-sm text-white/90 drop-shadow-md">تعریف تسک</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white rounded-t-3xl min-h-screen px-5 py-6 pb-24 -mt-12 relative z-10"
      >
        {/* Digit Header with Guide Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex justify-between w-full items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-700 px-4 py-2.5 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
              <span className="font-bold text-white text-lg">دیجیت</span>
            </div>
            <button
              onClick={() => setShowDigitGuide(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <QuestionMarkCircleIcon className="w-7 h-7 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Tasks Content */}
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 px-4"
          >
            <div className="rounded-full w-24 h-24 flex items-center justify-center mb-6 border border-black">
              <CurrencyDollarIcon className="w-12 h-12 text-black" />
            </div>

            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                هنوز تسک دیجیتی وجود ندارد
              </h3>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                برای شروع، اولین تسک با دیجیت را برای فرزند خود تعریف کنید
              </p>

              <motion.button
               onClick={handleAddTask}
                className="bg-indigo-700 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-colors shadow-sm"
                whileTap={{ scale: 0.98 }}
              >
                افزودن تسک جدید
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-200">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {task.reward} دیجیت
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>



      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewTask({ title: "", reward: "" });
        }}
        title="افزودن تسک دیجیتی"
        maxHeight="70vh"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="taskTitle"
              className="block text-sm font-semibold text-gray-700"
            >
              عنوان تسک
            </label>
            <input
              type="text"
              id="taskTitle"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
              placeholder="مثال: انجام تکالیف روزانه"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="taskReward"
              className="block text-sm font-semibold text-gray-700"
            >
              مقدار دیجیت
            </label>
            <input
              type="number"
              id="taskReward"
              value={newTask.reward}
              onChange={(e) =>
                setNewTask({ ...newTask, reward: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-300 outline-none transition-all"
              placeholder="100"
              dir="ltr"
              min="1"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveTask}
            disabled={!newTask.title.trim() || !newTask.reward.trim()}
            className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-6 h-6" />
            <span>ذخیره تسک</span>
          </motion.button>
        </div>
      </Modal>

      {/* Digit Guide Modal */}
      <Modal
        isOpen={showDigitGuide}
        onClose={() => setShowDigitGuide(false)}
        title="دیجیت چیست؟"
        maxHeight="70vh"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full w-20 h-20 flex items-center justify-center border border-indigo-700">
              <CurrencyDollarIcon className="w-10 h-10 text-indigo-700" />
            </div>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-base">
              <strong className="text-gray-900">دیجیت</strong> یک واحد پاداش
              دیجیتالی است که فرزند شما با انجام تسک‌ها و فعالیت‌های مختلف
              می‌تواند کسب کند.
            </p>

            <div className="bg-indigo-700 rounded-xl p-4 space-y-2 border ">
              <h4 className="font-bold text-white mb-2">کاربردهای دیجیت:</h4>
              <ul className="space-y-2 text-sm text-white list-disc list-inside">
                <li>تبدیل به پول نقد در کیف پول</li>
                <li>خرید از فروشگاه دیجیتال</li>
                <li>دسترسی به امتیازات و پاداش‌های ویژه</li>
                <li>مدیریت بهتر پس‌انداز و خرج کردن</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              با تعریف تسک‌های مختلف برای فرزند خود، می‌توانید به او کمک کنید تا
              با انجام کارهای مفید، دیجیت کسب کند و مدیریت مالی را یاد بگیرد.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DefineTaskPage;
