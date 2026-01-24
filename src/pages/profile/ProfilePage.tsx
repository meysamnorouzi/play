import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeftIcon, 
  ShoppingCartIcon, 
  PencilSquareIcon, 
  Cog6ToothIcon, 
  GiftIcon, 
  HeartIcon, 
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { slides } from '../../components/home/HomeInfoModal'
import EditProfileModal from '../../components/profile/EditProfileModal'

function ProfilePage() {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(1)
  const [showEditModal, setShowEditModal] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Read selected slide from localStorage
  useEffect(() => {
    const savedSlide = localStorage.getItem('selectedSlide')
    if (savedSlide) {
      setSelectedSlideIndex(parseInt(savedSlide))
    }
    
    const handleSlideChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setSelectedSlideIndex(customEvent.detail)
    }
    
    window.addEventListener('slideChanged', handleSlideChange)
    return () => window.removeEventListener('slideChanged', handleSlideChange)
  }, [])

  // Convert date to display format - kept for future use
  // const formatBirthDate = (date?: string) => {
  //   if (!date) return 'تاریخ تولد ثبت نشده'
  //   return date
  // }

  // Display user's full name
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || 'کاربر میهمان'

  // Create username from phone number
  const username = user?.phone ? `@${user.phone.substring(0, 4)}****` : '@user'

  // User profile image
  const userAvatar = user?.avatar || '/avatar/a3efb9801a4b75deacd1d69995b3615a.jpg'

  // Get selected slide
  const selectedSlide = slides[selectedSlideIndex]
  
  // Use selected slide image as cover
  const coverImage = selectedSlide.image

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: Cog6ToothIcon, label: 'تنظیمات حساب', color: 'text-gray-700', onClick: () => {} },
    { icon: ShoppingCartIcon, label: 'سفارشات من', color: 'text-gray-700', badge: '3', onClick: () => {} },
    { icon: HeartIcon, label: 'علاقه‌مندی‌ها', color: 'text-gray-700', onClick: () => {} },
    { icon: GiftIcon, label: 'جوایز و امتیازات', color: 'text-gray-700', onClick: () => {} },
    { icon: ArrowRightOnRectangleIcon, label: 'خروج از حساب', color: 'text-gray-700', onClick: handleLogout },
  ]

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header with Cover Image */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-56 bg-gray-950 relative overflow-hidden">
          <img 
            src={coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
    

          {/* Settings Button */}
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
          >
           <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Profile Avatar - Overlapping */}
        <div className="absolute -bottom-16 right-1/2 transform translate-x-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img 
                src={userAvatar} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status */}
            <div className="absolute bottom-2 left-2 w-5 h-5 bg-gray-800 rounded-full border-3 border-white"></div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-20 px-4 pb-24">
        {/* User Info */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h1>
          <p className="text-gray-500 text-sm mb-4">{username}</p>

          {/* Action Button */}
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-indigo-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <PencilSquareIcon className="w-5 h-5" />
            ویرایش پروفایل
          </button>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">اطلاعات کاربری</h3>
          <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">شماره تلفن:</span>
                <span className="text-gray-900 font-medium" dir="ltr">09163761606</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">ایمیل:</span>
                <span className="text-gray-900 font-medium" dir="ltr">sr.mohammad.mehrabi@gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">کد ملی:</span>
                <span className="text-gray-900 font-medium" dir="ltr">4120972917</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">تاریخ تولد:</span>
                <span className="text-gray-900 font-medium">1384/01/05</span>
              </div>
          </div>
        </div>



        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`${item.color} bg-gray-50 p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">

                  <ChevronLeftIcon className="w-5 h-5 text-gray-400 " />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Edit profile modal */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  )
}

export default ProfilePage

