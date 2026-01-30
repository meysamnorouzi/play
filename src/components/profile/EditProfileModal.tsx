import { useState, useEffect } from 'react'
import Modal from '../Modal'
import DatePicker from '../DatePicker'
import { Input } from '../ui'
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
          
          {/* Avatar grid - 2 rows, horizontal scroll */}
          <div className="overflow-x-auto overflow-y-hidden p-2">
            <div className="grid grid-flow-col grid-rows-2 auto-cols-[52px] gap-3 w-max">
              {AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInputChange('avatar', avatar)}
                  className={`relative w-12 h-12 rounded-full overflow-hidden transition-all transform hover:scale-105 flex-shrink-0 ${
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
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-200"></div>

        {/* First name */}
        <Input
          type="text"
          value={editForm.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="نام خود را وارد کنید"
          dir="rtl"
        />

        {/* Last name */}
        <Input
          type="text"
          value={editForm.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="نام خانوادگی خود را وارد کنید"
          dir="rtl"
        />

        {/* National ID */}
        <Input
          type="text"
          value={editForm.nationalId}
          onChange={(e) => handleInputChange('nationalId', e.target.value)}
          placeholder="کد ملی 10 رقمی"
          dir="ltr"
          maxLength={10}
        />

        {/* Email */}
        <Input
          type="email"
          value={editForm.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="example@email.com"
          dir="ltr"
        />

        {/* Birth date */}
        <div className="space-y-1">
          <DatePicker
            value={editForm.birthDate}
            onChange={(date) => handleInputChange('birthDate', date)}
            placeholder="تاریخ تولد خود را انتخاب کنید"
          />
        </div>

        {/* Phone number (non-editable) */}
        <div className="space-y-1">
          <Input
            type="tel"
            value={user?.phone || ''}
            onChange={() => {}}
            placeholder="شماره تلفن"
            dir="ltr"
            disabled
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
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EditProfileModal

