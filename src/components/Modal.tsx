import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/solid'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
  showHandleBar?: boolean
  maxHeight?: string
  backgroundColor?: string
}

/**
 * Reusable bottom sheet modal component with slide-up animation
 * @param isOpen - Controls whether the modal is open or closed
 * @param onClose - Callback function to close the modal
 * @param children - Content to render inside the modal
 * @param title - Optional modal title
 * @param showCloseButton - Show/hide close button (default: true)
 * @param showHandleBar - Show/hide handle bar at top (default: true)
 * @param maxHeight - Maximum height of modal (default: 85vh)
 */
function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  showHandleBar = true,
  maxHeight = '85vh',
  backgroundColor = 'bg-white'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#00000029] backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Content - constrained to mobile width */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 w-full max-w-[430px] ${backgroundColor} rounded-t-3xl shadow-2xl overflow-hidden transition-colors duration-500 flex flex-col pointer-events-auto`}
            style={{ 
              maxHeight,
              height: 'auto',
              minHeight: 'auto'
            }}
          >
            {/* Handle bar */}
            {showHandleBar && (
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Close button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10 flex-shrink-0"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            )}

            {/* Modal body */}
            <div 
              className="px-6 pb-8 pt-6 overflow-y-auto flex-1 flex flex-col min-h-0"
            >
              {title && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-gray-900 mb-6 text-center"
                >
                  {title}
                </motion.h2>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: title ? 0.2 : 0.1 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal

