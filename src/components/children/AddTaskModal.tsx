import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; reward: number }) => void;
}

function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [newTask, setNewTask] = useState({ title: '', reward: '' });

  const handleSaveTask = () => {
    if (!newTask.title.trim() || !newTask.reward.trim()) return;

    const reward = parseInt(newTask.reward);
    if (isNaN(reward) || reward <= 0) return;

    onAdd({
      title: newTask.title,
      reward: reward,
    });

    setNewTask({ title: '', reward: '' });
    onClose();
  };

  const handleClose = () => {
    setNewTask({ title: '', reward: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعریف ماموریت"
      maxHeight="90vh"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="taskTitle"
            className="block text-sm font-semibold text-gray-700"
          >
            عنوان ماموریت
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
             تشویقی
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
          <span>ذخیره ماموریت</span>
        </motion.button>
      </div>
    </Modal>
  );
}

export default AddTaskModal;

