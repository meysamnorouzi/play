import { useState, useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Modal from '../Modal'
import DatePicker from '../DatePicker'
import { useAuth } from '../../context/AuthContext'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

// List of available avatars (from /image/avatars/)
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
          
          {/* Avatar grid */}
          <div className="grid grid-cols-6 gap-3">
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
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            انصراف
          </button>
          <button
            onClick={handleSaveProfile}
            className="flex-1 bg-[#359C67] text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditProfileModal

