import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineFileText } from 'react-icons/ai'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'

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

interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  tasks: Task[];
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const day = date.getDate()
  const month = persianMonths[date.getMonth()]
  return `${day} ${month}`
}

function TasksModal({ isOpen, onClose, child, tasks }: TasksModalProps) {
  if (!child || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#00000029] z-50"
      />
      
      {/* Bottom Sheet - constrained to mobile width */}
      <div
        className="fixed bottom-0 w-full max-w-[430px] bg-white rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-16 h-1.5 bg-indigo-700/20 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                تسک‌های {child.firstName} {child.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{tasks.length} تسک</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <AiOutlineClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {task.status === 'completed' ? (
                          <AiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                        ) : task.status === 'in-progress' ? (
                          <AiOutlineClockCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AiOutlineClockCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <h4 className="font-semibold text-gray-900 text-base">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="bg-indigo-700 text-white px-3 py-1 rounded-full font-medium">
                          {task.category}
                        </span>
                        <span className="text-gray-500">{formatDate(task.date)}</span>
                        <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium border border-yellow-200 flex items-center gap-1">
                          <CurrencyDollarIcon className="w-3 h-3" />
                          {task.points || 0} دیجیت
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      task.status === 'completed' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : task.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-indigo-700 text-white'
                    }`}>
                      {task.status === 'completed' ? 'انجام شده' : 
                       task.status === 'in-progress' ? 'در حال انجام' : 'در انتظار'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AiOutlineFileText className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base font-medium">هیچ تسکی در انتظار نیست</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TasksModal

