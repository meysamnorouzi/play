import { useState, useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Modal from '../Modal'
import DatePicker from '../DatePicker'
import { useAuth } from '../../context/AuthContext'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

// List of available avatars
const AVATARS = [
  '/avatar/a3efb9801a4b75deacd1d69995b3615a.jpg',
  '/avatar/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg',
  '/avatar/c9192eb573b0b721c5a0bab6def82fbf.jpg',
  '/avatar/0b976f0a7aa1aa43870e1812eee5a55d.jpg',
]

function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUser } = useAuth()

  // Edit form data
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    nationalId: user?.nationalId || '',
    birthDate: user?.birthDate || '',
    avatar: user?.avatar || AVATARS[0]
  })

  // Update form when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        nationalId: user.nationalId || '',
        birthDate: user.birthDate || '',
        avatar: user.avatar || AVATARS[0]
      })
    }
  }, [isOpen, user])

  const handleSaveProfile = () => {
    // Update user information
    updateUser(editForm)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="ویرایش پروفایل"
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
                src={editForm.avatar} 
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
                  editForm.avatar === avatar 
                    ? 'ring-4 ring-gray-900 ring-offset-2' 
                    : 'ring-2 ring-gray-200 hover:ring-gray-400'
                }`}
              >
                <img 
                  src={avatar} 
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {editForm.avatar === avatar && (
                  <div className="absolute inset-0 bg-indigo-700/20 flex items-center justify-center">
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
            value={editForm.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام خانوادگی
          </label>
          <input
            type="text"
            value={editForm.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            placeholder="نام خانوادگی خود را وارد کنید"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد ملی
          </label>
          <input
            type="text"
            value={editForm.nationalId}
            onChange={(e) => handleInputChange('nationalId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            placeholder="کد ملی 10 رقمی"
            maxLength={10}
            dir="ltr"
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ تولد
          </label>
          <DatePicker
            value={editForm.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            placeholder="تاریخ تولد خود را انتخاب کنید"
          />
        </div>

        {/* Phone number (non-editable) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره تلفن
          </label>
          <input
            type="text"
            value={user?.phone || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            dir="ltr"
          />
          <p className="text-xs text-gray-500 mt-1">
            شماره تلفن قابل ویرایش نیست
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSaveProfile}
            className="flex-1 bg-indigo-700 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            ذخیره تغییرات
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditProfileModal

