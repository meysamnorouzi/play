import { useState } from 'react';
import Modal from '../Modal';
import DatePicker from '../DatePicker';
import { Input } from '../ui';

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
        {/* First name - placeholder only, no label */}
        <Input
          type="text"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="نام فرزند را وارد کنید"
          error={errors.firstName}
          dir="rtl"
        />

        {/* Last name */}
        <Input
          type="text"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="نام خانوادگی فرزند را وارد کنید"
          error={errors.lastName}
          dir="rtl"
        />

        {/* National ID */}
        <Input
          type="text"
          value={formData.nationalId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) handleInputChange('nationalId', value);
          }}
          placeholder="کد ملی 10 رقمی"
          error={errors.nationalId}
          dir="ltr"
          maxLength={10}
        />

        {/* Birth date - separate DatePicker, placeholder only */}
        <div className="space-y-1">
          <DatePicker
            value={formData.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            placeholder="تاریخ تولد را انتخاب کنید"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.birthDate}
            </p>
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
            افزودن فرزند
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddChildModal;

