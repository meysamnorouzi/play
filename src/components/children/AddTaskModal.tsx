import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import { Input } from '../ui';

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

        <Input
          type="number"
          id="taskReward"
          value={newTask.reward}
          onChange={(e) =>
            setNewTask({ ...newTask, reward: e.target.value })
          }
          placeholder="100"
          dir="ltr"
          min={1}
        />

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveTask}
          disabled={!newTask.title.trim() || !newTask.reward.trim()}
          className="w-full bg-gradient-to-l from-[#359C67] to-[#359C67] hover:from-[#2E7D5A] hover:to-[#2E7D5A] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>ذخیره ماموریت</span>
        </motion.button>
      </div>
    </Modal>
  );
}

export default AddTaskModal;

