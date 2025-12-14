import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon, BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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


type TaskType = 'points' | 'money';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  reward: number;
}

function DefineTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<TaskType>('points');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!id) {
      navigate('/children');
      return;
    }

    // Load child data
    const storedChildren = localStorage.getItem('childrenList');
    if (storedChildren) {
      const children = JSON.parse(storedChildren);
      const foundChild = children.find((c: Child) => c.id === id);
      if (foundChild) {
        setChild(foundChild);
      } else {
        navigate('/children');
      }
    } else {
      navigate('/children');
    }

    // Load tasks for this child
    const storedTasks = localStorage.getItem(`tasks_${id}`);
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks);
      setTasks(allTasks);
    }
  }, [id, navigate]);

  const filteredTasks = tasks.filter(task => task.type === activeTab);

  const handleAddTask = () => {
    // TODO: Open add task modal/form
    console.log('افزودن تسک جدید');
  };

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen " dir="rtl">
      {/* Header with Avatar and Name */}
      <div className="bg-white border-b border-gray-200 relative">
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="relative">
            <img
              src={child.avatar}
              alt={`${child.firstName} ${child.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            {child.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900">
              {child.firstName} {child.lastName}
            </h1>
          </div>
          
          <button
            onClick={() => navigate(`/children/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-black"
          >
            <ArrowLeftIcon className="w-4 h-4 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 border ${
              activeTab === 'points'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <StarIcon className="w-5 h-5" />
            <span className="font-medium">پوینت</span>
          </button>
          
          <button
            onClick={() => setActiveTab('money')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 border ${
              activeTab === 'money'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <BanknotesIcon className="w-5 h-5" />
            <span className="font-medium">پول</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white min-h-[calc(100vh-200px)]">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            {/* Icon */}
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              {activeTab === 'points' ? (
                <StarIcon className="w-10 h-10 text-gray-400" />
              ) : (
                <BanknotesIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Text Content */}
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                {activeTab === 'points' ? 'هنوز تسک پوینتی وجود ندارد' : 'هنوز تسک پولی وجود ندارد'}
              </h3>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                {activeTab === 'points' 
                  ? 'برای شروع، اولین تسک با پوینت را برای فرزند خود تعریف کنید'
                  : 'برای شروع، اولین تسک با پول را برای فرزند خود تعریف کنید'}
              </p>
            </div>

            {/* Add Task Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTask}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              <span>افزودن تسک</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="p-4">
            {/* لیست تسک‌ها */}
            {filteredTasks.map((task) => (
              <div key={task.id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                <p className="text-sm text-gray-600">
                  {activeTab === 'points' ? `${task.reward} پوینت` : `${task.reward} تومان`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DefineTaskPage;

