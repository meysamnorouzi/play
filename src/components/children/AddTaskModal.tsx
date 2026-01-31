import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import { Input } from '../ui';
import { formatBalance } from '../../utils/numberUtils';

// هر 100 دیجیت = 25000 تومان
const calculateMoneyFromDigits = (digits: number): number =>
  Math.floor((digits / 100) * 25000);

const SOURCE_TABS = [
  { id: 'radioteen' as const, label: 'رادیوتین', icon: '/icon/podcast.svg' },
  { id: 'shahrfarang' as const, label: 'شهرفرنگ', icon: '/icon/shahre%20farang.svg' },
  { id: 'digibook' as const, label: 'دیجی بوک', icon: '/icon/book.svg' },
];

export type TaskRewardType = 'digit' | 'money';
export type TaskSourceType = 'radioteen' | 'shahrfarang' | 'digibook';

export interface AddTaskPayload {
  title: string;
  reward: number;
  rewardType: TaskRewardType;
  source?: TaskSourceType;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: AddTaskPayload) => void;
}

function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [newTask, setNewTask] = useState({ title: '', reward: '' });
  const [isDigitMode, setIsDigitMode] = useState(true);
  const [activeSource, setActiveSource] = useState<TaskSourceType>('radioteen');

  const handleSaveTask = () => {
    if (!newTask.title.trim() || !newTask.reward.trim()) return;

    const rewardNum = parseFloat(newTask.reward);
    if (isNaN(rewardNum) || rewardNum <= 0) return;

    onAdd({
      title: newTask.title.trim(),
      reward: Math.floor(rewardNum),
      rewardType: isDigitMode ? 'digit' : 'money',
      source: activeSource,
    });

    setNewTask({ title: '', reward: '' });
    onClose();
  };

  const handleClose = () => {
    setNewTask({ title: '', reward: '' });
    onClose();
  };

  const rewardNum = parseFloat(newTask.reward) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعریف ماموریت"
      maxHeight="90vh"
    >
      <div className="space-y-6" dir="rtl">
      <p className="text-sm text-gray-900">
      از بین دسته‌بندی‌های دیجی‌تینی، ماموریت یادگیری برای فرزندتان تعریف کنید
        </p>
        {/* تب‌ها: رادیوتین، شهرفرنگ، دیجی بوک */}
        <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSource(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${activeSource === tab.id
                  ? 'bg-[#359C67] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <img src={tab.icon} alt="" className="w-5 h-5 shrink-0" aria-hidden />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-900">
          ماموریت‌ اختصاصی فرزند خود، را تعریف کن
        </p>
        <Input
          type="text"
          id="taskTitle"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          placeholder="مثال: انجام تکالیف روزانه"
          dir="rtl"
        />

        {/* Toggle: دیجیت / تومان */}
        <div className="flex items-center gap-2 py-2">
          <span className={`text-sm font-medium ${isDigitMode ? 'text-gray-900' : 'text-gray-500'}`}>
            پاداش به دیجیت
          </span>
          <button
            onClick={() => {
              setIsDigitMode(!isDigitMode);
              setNewTask((prev) => ({ ...prev, reward: '' }));
            }}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#359C67] focus:ring-offset-2 ${isDigitMode ? 'bg-[#359C67]' : 'bg-gray-300'}`}
            type="button"
            role="switch"
            aria-checked={isDigitMode}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${isDigitMode ? 'translate-x-[-22px]' : 'translate-x-[-2px]'}`}
            />
          </button>
        </div>

        {/* Reward Input */}
        <div className="space-y-3">
          <Input
            type="number"
            id="taskReward"
            value={newTask.reward}
            onChange={(e) =>
              setNewTask({ ...newTask, reward: e.target.value })
            }
            placeholder={isDigitMode ? 'مثال: 100' : 'مثال: 25000'}
            dir="ltr"
            min={1}
            inputClassName="text-lg border-2 focus:border-[#359C67] focus:ring-[#359C67]/20"
          />

          {isDigitMode && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900">مبلغ معادل:</span>
                <span className="text-lg font-bold text-blue-700">
                  {formatBalance(calculateMoneyFromDigits(rewardNum))} تومان
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-100/50 rounded-lg px-3 py-1.5">
                <span>هر 100 دیجیت = 25,000 تومان</span>
              </div>
            </div>
          )}

          {!isDigitMode && (
            <p className="text-xs text-gray-500">
              پاداش به تومان
            </p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveTask}
          disabled={!newTask.title.trim() || !newTask.reward.trim() || rewardNum <= 0}
          className="w-full bg-gradient-to-l from-[#359C67] to-[#359C67] hover:from-[#2E7D5A] hover:to-[#2E7D5A] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>ذخیره ماموریت</span>
        </motion.button>
      </div>
    </Modal>
  );
}

export default AddTaskModal;
