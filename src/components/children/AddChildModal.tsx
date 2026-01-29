import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import DatePicker from '../DatePicker';

// List of available avatars (from /image/avatars/) - used for default assignment
const AVATARS = [
  '/image/avatars/piri.svg',
  '/image/avatars/hony.svg',
  '/image/avatars/simi.svg',
  '/image/avatars/rishi.svg',
  '/image/avatars/kopi.svg',
  '/image/avatars/sono.svg',
  '/image/avatars/oso.svg',
  '/image/avatars/hoso.svg',
  '/image/avatars/kojo.svg',
  '/image/avatars/koko.svg',
  '/image/avatars/hobi.svg',
  '/image/avatars/sojo.svg',
  '/image/avatars/soso.svg',
  '/image/avatars/momo.svg',
  '/image/avatars/bobo.svg',
];

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (childData: {
    firstName: string;
    lastName: string;
    nationalId: string;
    birthDate: string;
    avatar: string;
  }) => void;
}

function AddChildModal({ isOpen, onClose, onAdd }: AddChildModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'نام الزامی است';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'کد ملی الزامی است';
    } else if (formData.nationalId.length !== 10) {
      newErrors.nationalId = 'کد ملی باید 10 رقمی باشد';
    } else if (!/^\d+$/.test(formData.nationalId)) {
      newErrors.nationalId = 'کد ملی باید فقط عدد باشد';
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'تاریخ تولد الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Assign a random default avatar
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      onAdd({
        ...formData,
        avatar: randomAvatar,
      });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        nationalId: '',
        birthDate: '',
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form and errors when closing
    setFormData({
      firstName: '',
      lastName: '',
      nationalId: '',
      birthDate: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="افزودن فرزند"
      maxHeight="90vh"
    >
      <div className="space-y-6" dir="rtl">
        {/* First name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="نام فرزند را وارد کنید"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام خانوادگی
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="نام خانوادگی فرزند را وارد کنید"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد ملی
          </label>
          <input
            type="text"
            value={formData.nationalId}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Only numbers
              if (value.length <= 10) {
                handleInputChange('nationalId', value);
              }
            }}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all ${
              errors.nationalId ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="کد ملی 10 رقمی"
            maxLength={10}
            dir="ltr"
          />
          {errors.nationalId && (
            <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
          )}
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ تولد
          </label>
          <DatePicker
            value={formData.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            placeholder="تاریخ تولد را انتخاب کنید"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#359C67] text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            افزودن فرزند
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddChildModal;

