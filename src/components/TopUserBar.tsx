import { useState } from 'react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import MenuModal from './home/MenuModal'
import { useNavigate } from 'react-router-dom'

function TopUserBar() {
  const { user } = useAuth()
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || 'کاربر میهمان'

  const userAvatar = user?.avatar || '/image/avatars/piri.svg'
  const navigate = useNavigate()

  return (
    <>
      <div className="w-full bg-[#359C67]">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300 min-w-0"
            onClick={() => setIsMenuModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <img
                src={userAvatar}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white text-base font-medium truncate">{fullName}</p>
          </div>
          <ChatBubbleLeftRightIcon   onClick={() => navigate('/messages')} className="w-7 h-7 text-white/70 cursor-pointer hover:text-white hover:scale-110 transition-all duration-300 shrink-0" />
        </div>
      </div>

      <MenuModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} />
    </>
  )
}

export default TopUserBar

