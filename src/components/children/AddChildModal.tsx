import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Modal from '../Modal';
import DatePicker from '../DatePicker';

// List of available avatars
const AVATARS = [
  '/avatar/a3efb9801a4b75deacd1d69995b3615a.jpg',
  '/avatar/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
  '/avatar/c9192eb573b0b721c5a0bab6def82fbf.jpg',
  '/avatar/0b976f0a7aa1aa43870e1812eee5a55d.jpg',
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
    avatar: AVATARS[0],
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
      onAdd(formData);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        nationalId: '',
        birthDate: '',
        avatar: AVATARS[0],
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
      avatar: AVATARS[0],
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
        {/* Avatar selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            انتخاب تصویر پروفایل
          </label>
          
          {/* Current avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden shadow-lg">
              <img 
                src={formData.avatar} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Avatar grid */}
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleInputChange('avatar', avatar)}
                className={`relative w-full aspect-square rounded-full overflow-hidden transition-all transform hover:scale-105 ${
                  formData.avatar === avatar 
                    ? 'ring-4 ring-gray-900 ring-offset-2' 
                    : 'ring-2 ring-gray-200 hover:ring-gray-400'
                }`}
              >
                <img 
                  src={avatar} 
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {formData.avatar === avatar && (
                  <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-200"></div>

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
            onClick={handleSubmit}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            افزودن فرزند
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddChildModal;

